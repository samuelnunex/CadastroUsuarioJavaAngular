import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'MENU PRINCIPAL',
    group: true,
  },
  
  {
    title: 'Usuários',
    icon: 'lock-outline',
    children: [
      {
        title: 'Cadastro',
        link: '/usuario/cadastro',
      },
      {
        title: 'Lista Usuários',
        link: '/usuario/lista',
      },
    ],
  },
];
