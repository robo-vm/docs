import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'getting-started',
    'roadmap',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/dataflow',
        'architecture/components',
      ],
    },
    {
      type: 'category',
      label: 'Blockchain',
      items: [
        'blockchain/overview',
        'blockchain/architecture',
        'blockchain/workflow',
      ],
    },
    {
      type: 'category',
      label: 'ROBOX Token',
      items: [
        'token/overview',
        'token/tokenomics',
        'token/smart-contract',
        'token/use-cases',
      ],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'contracts/robo-task',
        'contracts/reputation',
      ],
    },
  ],
};

export default sidebars;
