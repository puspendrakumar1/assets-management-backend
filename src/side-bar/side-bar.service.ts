import { Injectable } from '@nestjs/common';

@Injectable()
export class SideBarService {
  async getSizeBarTabs() {
    return {
      data: [
        {
          id: 'dashboards',
          title: 'Dashboards',
          // subtitle: 'Unique dashboard designs',
          type: 'group',
          icon: 'heroicons_outline:home',
          children: [
            {
              id: 'dashboards.project',
              title: 'Project',
              type: 'basic',
              icon: 'heroicons_outline:clipboard-check',
              link: '/dashboards/project',
            },
            {
              id: 'dashboards.analytics',
              title: 'Analytics',
              disabled: true,
              type: 'basic',
              icon: 'heroicons_outline:chart-pie',
              link: '/dashboards/analytics',
            },
            {
              id: 'dashboards.finance',
              title: 'Finance',
              type: 'basic',
              disabled: true,
              icon: 'heroicons_outline:cash',
              link: '/dashboards/finance',
            },
          ],
        },
        {
          id: 'apps',
          title: 'Management',
          subtitle: 'Custom made application designs',
          type: 'group',
          icon: 'heroicons_outline:home',
          children: [
            {
              id: 'apps.chat',
              title: 'Chat',
              type: 'basic',
              disabled: true,
              icon: 'heroicons_outline:chat-alt',
              link: '/apps/chat',
            },
            {
              id: 'apps.contacts',
              title: 'Contacts',
              type: 'basic',
              icon: 'heroicons_outline:user-group',
              link: '/apps/contacts',
            },
            {
              icon: 'heroicons_outline:shopping-cart',

              id: 'apps.ecommerce.inventory',
              title: 'Inventory',
              type: 'basic',
              link: '/apps/ecommerce/inventory',
            },

            {
              id: 'apps.help-center',
              title: 'Help Center',
              type: 'collapsable',
              icon: 'heroicons_outline:support',
              link: '/apps/help-center',
              children: [
                {
                  id: 'apps.help-center.home',
                  title: 'Home',
                  type: 'basic',
                  link: '/apps/help-center',
                  exactMatch: true,
                },
                {
                  id: 'apps.help-center.faqs',
                  title: 'FAQs',
                  type: 'basic',
                  link: '/apps/help-center/faqs',
                },
                {
                  id: 'apps.help-center.guides',
                  title: 'Guides',
                  type: 'basic',
                  link: '/apps/help-center/guides',
                },
                {
                  id: 'apps.help-center.support',
                  title: 'Support',
                  type: 'basic',
                  link: '/apps/help-center/support',
                },
              ],
            },

            {
              id: 'apps.tasks',
              title: 'Tasks',
              type: 'basic',
              icon: 'heroicons_outline:check-circle',
              link: '/apps/tasks',
            },
          ],
        },
        {
          id: 'pages',
          title: 'Pages',
          subtitle: 'Custom made page designs',
          type: 'group',
          icon: 'heroicons_outline:document',
          children: [
            {
              id: 'pages.activities',
              title: 'Activities',
              type: 'basic',
              icon: 'heroicons_outline:menu-alt-2',
              link: '/pages/activities',
            },

            {
              id: 'pages.invoice',
              title: 'Invoice',
              type: 'collapsable',
              icon: 'heroicons_outline:calculator',
              children: [
                {
                  id: 'pages.invoice.printable',
                  title: 'Printable',
                  type: 'collapsable',
                  children: [
                    {
                      id: 'pages.invoice.printable.compact',
                      title: 'Compact',
                      type: 'basic',
                      link: '/pages/invoice/printable/compact',
                    },
                    {
                      id: 'pages.invoice.printable.modern',
                      title: 'Modern',
                      type: 'basic',
                      link: '/pages/invoice/printable/modern',
                    },
                  ],
                },
              ],
            },

            {
              id: 'pages.settings',
              title: 'Settings',
              type: 'basic',
              icon: 'heroicons_outline:cog',
              link: '/pages/settings',
            },
          ],
        },
        {
          id: 'user-interface',
          title: 'User Interface',
          subtitle: 'Building blocks of the UI & UX',
          type: 'group',
          icon: 'heroicons_outline:collection',
          children: [
            {
              id: 'user-interface.advanced-search',
              title: 'Advanced Search',
              type: 'basic',
              icon: 'heroicons_outline:search-circle',
              link: '/ui/advanced-search',
            },

            {
              id: 'user-interface.confirmation-dialog',
              title: 'Confirmation Dialog',
              type: 'basic',
              icon: 'heroicons_outline:question-mark-circle',
              link: '/ui/confirmation-dialog',
            },

            {
              id: 'user-interface.forms',
              title: 'Forms',
              type: 'collapsable',
              icon: 'heroicons_outline:pencil-alt',
              children: [
                {
                  id: 'user-interface.forms.fields',
                  title: 'Fields',
                  type: 'basic',
                  link: '/ui/forms/fields',
                },
                {
                  id: 'user-interface.forms.layouts',
                  title: 'Layouts',
                  type: 'basic',
                  link: '/ui/forms/layouts',
                },
                {
                  id: 'user-interface.forms.wizards',
                  title: 'Wizards',
                  type: 'basic',
                  link: '/ui/forms/wizards',
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
