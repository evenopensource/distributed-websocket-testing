import React from 'react';
import ConfigCard from '../Cards/configCard';
import MessageProcessors from '../Cards/processor';
import ConfigCard2 from '../Cards/configCard2';
import DataScripts from '../Cards/data-script';
import { useTestConfigStore } from '../../store/app-store';

interface Field {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  options?: { label: string; value: string }[];
  width: number;
}

interface ServerConfig {
  type: string;
  header: string;
  fields?: Field[];
}

interface ContentProps {
  serverConfig: ServerConfig[];
}

const Content: React.FC<ContentProps> = ({ serverConfig }) => {


  return (
    <div>
      {serverConfig.map((config, index) => {
        switch (config.type) {
          case 'card2':
            return (
              <div key={index}>
                <ConfigCard2 serverConfig={{ header: config.header, fields: config.fields || [] }} />
              </div>
            );
          case 'card':
            return (
              <div key={index}>
                <ConfigCard serverConfig={{ header: config.header, fields: config.fields || [] }} />
              </div>
            );
          case 'messageProcessor':
            return (
              <div key={index} >
                <MessageProcessors serverConfig={{ header: config.header, fields: config.fields || [] }}  />
              </div>
            );
          case 'scripts':
            return (
              <div key={index} style={{marginBottom:"100px"}}>
                <DataScripts serverConfig={{ header: config.header, fields: config.fields || [] }} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Content;
