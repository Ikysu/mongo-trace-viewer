import React, { useState, useEffect } from "react";
import { SettingsModel } from "../models/SettingsModel";
import { ActionButton } from "./form/ActionButton";
import { ButtonsGroup } from "./form/ButtonsGroup";
import { InputGroup } from "./form/InputGroup";
import { Select } from "./form/Select";
import "./settingsForm.styl";

export type Server = {
  name: string;
  value: string;
};

export interface SettingsFormProps {
  value: SettingsModel;
  servers: Array<Server>;
  onSave: (model: SettingsModel) => Promise<void>;
}

export function SettingsForm(props: SettingsFormProps) {
  const [server, setServer] = useState(props.value.name);

  const saveSettings = async () => {
    await props.onSave({
      name: server,
    });
    window._RELOADPREFILL?.();
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        saveSettings();
      }}
      autoComplete="off"
    >
      <InputGroup className="oplog-settings-group">
        <Select
          name="name"
          onChange={setServer}
          pleaseSelectLabel="Please select..."
          value={server}
          options={props.servers}
          label="Server:"
        />
        <div className="oplog-settings__connection-string-example">
          Помни, что если ты его поменяешь, он поменяется у всех! Лучше поди и
          спроси в чатике, не использует ли сейчас кто то трейсер.
        </div>
      </InputGroup>
      <ButtonsGroup className="oplog-settings-buttons-group">
        <ActionButton label="Save" type="submit" />
      </ButtonsGroup>
    </form>
  );
}
