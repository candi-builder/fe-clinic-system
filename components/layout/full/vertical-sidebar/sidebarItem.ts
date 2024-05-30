import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

export const sidebarItemDokter: menu[] = [
    { header: 'Home' },
    {
        title: 'antrian passien',
        icon: LayoutDashboardIcon,
        to: '/dokter'
    },
];
export const sidebarItemApoteker: menu[] = [
    { header: 'Home' },
    {
        title: 'antrian passien',
        icon: LayoutDashboardIcon,
        to: '/dokter'
    },
];
export const sidebarItemSuperadmin: menu[] = [
    { header: 'Home' },
    {
        title: 'management user',
        icon: LayoutDashboardIcon,
        to: '/superadmin/management-user'
    },
    {
        title: 'management poli',
        icon: LayoutDashboardIcon,
        to: '/superadmin/poli'
    },
];

