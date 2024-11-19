import { SettingsModel } from "./SettingsModel";

export interface ConfigStatusResponse extends SettingsModel {
    isConfigured: boolean;
    list: Array<{
        name: string;
        value: string;
    }>
    isConnectionStringEditLocked: boolean
}