import { StringMappingType } from "typescript"

export enum Hooks {
    SidebarManageMenuItems = 'SidebarManageMenuItems',
    AppRoute = 'AppRoute'
}

export type SidebarManageMenuItemHookResult = {
    menuTitle: string
    path: string
    icon: string
}