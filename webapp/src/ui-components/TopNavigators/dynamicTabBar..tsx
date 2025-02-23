import React, { useState } from 'react';
import { Tabs, Tab, IconButton, Box, Menu, MenuItem } from '@mui/material';
import evenIcon from '../../assets/evenLogo.svg';
import CloseIcon from '@mui/icons-material/Close';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useBoundStore } from '@renderer/store/useBoundStore';

interface TabItem {
  label: string;
  id: number;
}

const DynamicTabs: React.FC = () => {
  // const [tabs, setTabs] = useState<TabItem[]>([
  //   { label: 'ws://localhost:8080', id: 1 },
  //   { label: 'ws://localhost:8080', id: 2 },
  //   { label: 'ws://localhost:8080', id: 3 },
  // ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const tabs = useBoundStore((state) => state.tabs.items)
  const setSelectedTab = useBoundStore((state) => state.tabs.setSelectedTab)
  const remove = useBoundStore((state) => state.tabs.remove)
  const add = useBoundStore((state) => state.tabs.add)
  const setTabs = useBoundStore((state) => state.tabs.reorder)
  const selectedTab = useBoundStore((state) => state.tabs.selectedTabId)
  // const selectedTabIndex = useBoundStore((state) => state.tabs.selectedTabIndex)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(tabs[newValue])
  };

  const handleTabClose = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent tab selection when closing
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: '80%', borderBottom: 1, borderColor: 'divider', display: 'flex', position: "fixed", top: 0, backgroundColor: "white", zIndex: 100 }}>
      <Tabs value={selectedTab-1} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: "blue", height: "1px" } }} aria-label="dynamic tabs" variant="scrollable" scrollButtons="auto">

        {tabs.map((tab, index) => (
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {tab.label}
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={(e) => remove(tab)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                {index !== tabs.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%', // Centers the divider vertically
                      transform: 'translateY(-50%)', // Adjust to make the divider shorter
                      width: '1px',
                      height: '50%', // Adjust this to make the divider shorter
                      backgroundColor: '#ddd',
                    }}
                  />
                )}
              </Box>
            }
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default DynamicTabs;
