import { WebSocketServer } from "ws";
import { createClient } from "redis";
import axios from "axios";

const wss = new WebSocketServer({ port: process.env.PORT });

const httpServerCall = async () => {
  const response = await axios.get("http://localhost:7991/");
  console.log(response.data);
};

httpServerCall();

//Store the websocket connections
const students = {};
const professors = {};

let redisPublisher, redisSubscriber;
(async function () {
  //Connecting to redis
  try {
    //Initializing the redis clients
    redisPublisher = await createClient()
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
    redisSubscriber = await createClient()
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
    redisSubscriber.on("error", (err) =>
      console.error("Redis Client Error", err)
    );

    const studentListener = (message, channel) => {
      const data = JSON.parse(message, process.env.PORT);
      console.log("@@@@@@@@@2", message);
      //since the server which publishes the message in Redis Pubsub also receives the same message again. Check the server port(not the ideal way) if they dont match send the data to the websocket connections
      if (data.parentServerPort !== process.env.PORT) {
        const department = data.stuDepartment
          ? data.stuDepartment
          : data.department;
        const year = data.stuYear ? data.stuYear : data.year;
        const stuBroadcast = students[`${department}#${year}`];
        //filter the students based on their section
        const stuFiltered =
          stuBroadcast &&
          Object.keys(stuBroadcast)?.filter((stuId) => {
            const section = data.stuSection ? data.stuSection : data.section;
            return stuId.split("#")?.[1] === section;
          });
        console.log("###########", stuBroadcast);
        stuFiltered?.forEach((stuId) => {
          console.log(
            "___________________-----------------------____________________",
            stuId
          );
          stuBroadcast[stuId]?.send(JSON.stringify(data));
        });
      }
    };

    const professorListener = (message, channel) => {
      const data = JSON.parse(message);
      const professor = professors[data.profId];
      if (professor) {
        professor.send(JSON.stringify(data));
      }
    };

    await redisSubscriber.subscribe("student_channel", studentListener);
    await redisSubscriber.subscribe("professor_channel", professorListener);
  } catch (error) {
    console.log("Error in redis", error);
  }
})();

const studentBroadcaster = async (
  department,
  year,
  section,
  data,
  selfId = 0
) => {
  const stuBroadcast = students[`${department}#${year}`];
  //filter the students based on their section
  const stuFiltered =
    stuBroadcast &&
    Object.keys(stuBroadcast)?.filter((stuId) => {
      return stuId.split("#")?.[1] === section;
    });
  stuFiltered?.forEach((stuId) => {
    console.log();
    if (selfId !== stuBroadcast[stuId]?.id) {
      stuBroadcast[stuId]?.send(JSON.stringify(data));
    }
  });
  //Some students might be in other websocket servers. Use redis pubsub to send message to other websocket servers
  data = { ...data, parentServerPort: process.env.PORT };
  await redisPublisher.publish("student_channel", JSON.stringify(data));
};

wss.on("connection", function connection(ws) {
  console.log("New connection to web socket server at ", process.env.PORT);
  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    console.log("received: %s", data);
    data = JSON.parse(data);

    if (data.action === "student_join") {
      //Store the keys for identifying the student in the websocket connection object
      ws.id = data.id;
      ws.year = data.year;
      ws.section = data.section;
      ws.department = data.department;
      ws.isStudent = true;

      if (students[`${data.department}#${data.year}`]) {
        students[`${data.department}#${data.year}`][
          `${data.id}#${data.section}`
        ] = ws;
      } else {
        const studentData = { [`${data.id}#${data.section}`]: ws };
        students[`${data.department}#${data.year}`] = studentData;
      }
      //Broadcast the student join message to other students in the same department, year, section
      await studentBroadcaster(
        data.department,
        data.year,
        data.section,
        data,
        data.id
      );
    } else if (data.action === "professor_join") {
      //Store the keys for identifying the professor in the websocket connection object
      ws.id = data.id;
      professors[`${data.id}`] = ws;
    } else if (data.action === "professor_broadcast") {
      await studentBroadcaster(
        data.stuDepartment,
        data.stuYear,
        data.stuSection,
        data
      );
    } else if (data.action === "student_send") {
      const professor = professors[data.profId];
      if (professor) {
        professor.send(data);
      } else {
        //If the professor is not found in the this websocket server send it through redis pubsub to other websocket servers.
        data = { ...data, parentServerPort: process.env.PORT };
        await redisPublisher.publish("professor_channel", JSON.stringify(data));
      }
    }
  });

  ws.on("close", async () => {
    const data = {
      action: "student_leave",
      id: ws.id,
      year: ws.year,
      section: ws.section,
      department: ws.department,
    };
    //If the closed websocket connection is from a student then broadcast the message to other students
    if (ws.isStudent) {
      await studentBroadcaster(ws.department, ws.year, ws.section, data, ws.id);
    }
  });
});
