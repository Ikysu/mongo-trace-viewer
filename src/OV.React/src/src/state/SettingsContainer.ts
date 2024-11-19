import { EventTypes } from "../models/EventTypes";
import { SettingsModel } from "../models/SettingsModel";
import { ConfigService } from "../services/ConfigService";
import EventHub from "../services/EventHub";
import { BaseContainer } from "./BaseContainer";
import { ServiceContainer } from "./ServiceContainer";

export interface SettingsContainerState {
    settings: SettingsModel,
    isConfigured: boolean,
    isSettingsOpened : boolean,
    isConnectionStringEditLocked: boolean,
    servers: Array<{
        name: string,
        value: string
    }>
}

export class SettingsContainer extends BaseContainer<SettingsContainerState> {
    state: SettingsContainerState = {
        settings: {
            name: ""
        },
        servers: [],
        isConfigured: false,
        isSettingsOpened: false,
        isConnectionStringEditLocked: false
    };

    constructor(serviceContainer: ServiceContainer){
        super(serviceContainer);
    }

    initialize = async (): Promise<void> => {
        const configStatus = await this.makeRequest(() => ConfigService.getConfigStatus());
        
        await this.setState({
            isConfigured: configStatus.isConfigured,
            settings: {
                name: configStatus.name ?? ""
            },
            servers: configStatus.list,
            isSettingsOpened: configStatus.isConfigured === false && !configStatus.isConnectionStringEditLocked,
            isConnectionStringEditLocked: configStatus.isConnectionStringEditLocked
        });
    }

    isAppCouldBeUsed = () => {
        return !(!this.isSettingsValid() && this.state.isConnectionStringEditLocked);
    }

    isSettingsValid = () => {
        return this.state.isConfigured === true;
    }

    closeSettings = () => {
        return this.setState({
            isSettingsOpened: false
        })
    }

    openSettings = () => {
        return this.setState({
            isSettingsOpened: true
        })
    }

    saveSettings = async (model: SettingsModel) => {
        const result = await this.makeRequest(() => ConfigService.saveConfig({
            name: model.name
        }));

        const isConnectionStringChanged = result.name != this.state.settings.name
            && result.isConfigured === true;

        await this.setState({
            isConfigured: result.isConfigured,
            settings: {
                name: result.name ?? ""
            },
            isSettingsOpened: result.isConfigured === false
        });

        if(isConnectionStringChanged) {
            EventHub.emit(EventTypes.CONNECTION_STRING_CHANGED, {});
        }
        
    }
}