export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: 'Dashboard',
    items: [
      {
        name: 'Onboarding',
        slug: 'onboarding',
        description: 'Set up your company profile and data preferences',
      },
      // {
      //   name: 'Personas',
      //   slug: 'onboarding/personas',
      //   description: 'Configure personas for filtering data',
      // },
      // {
      //   name: 'Authority Levels',
      //   slug: 'onboarding/authority-levels',
      //   description: 'Define authority levels for your organization',
      // },
      // {
      //   name: 'Invite Users',
      //   slug: 'onboarding/invite-users',
      //   description: 'Add team members to your workspace',
      // },
    ],
  },
];
