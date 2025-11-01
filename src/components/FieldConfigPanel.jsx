import React, { useState, useEffect } from 'react';
const FieldConfigPanel = ({ field, onUpdate, onClose }) => {
  const [config, setConfig] = useState(field);
  useEffect(() => {
    setConfig(field);
  }, [field]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSave = () => {
    onUpdate(config);
    onClose();
  };
  return (
    <div className="field-config-panel">
      <h4>Field Settings</h4>
      <div className="config-group">
        <label>Label</label>
        <input type="text" name="label" value={config.label} onChange={handleChange} />
      </div>
      {(field.type === 'Short Answer' || field.type === 'Paragraph') && (
        <div className="config-group">
          <label>Placeholder</label>
          <input type="text" name="placeholder" value={config.placeholder} onChange={handleChange} />
        </div>
      )}
      {}
      <div className="config-group checkbox-group">
        <input type="checkbox" id="required" name="required" checked={config.required} onChange={handleChange} />
        <label htmlFor="required">Required Field</label>
      </div>
      <button onClick={handleSave} className="save-btn">Save</button>
      <button onClick={onClose} className="cancel-btn">Close</button>
    </div>
  );
};
export default FieldConfigPanel;