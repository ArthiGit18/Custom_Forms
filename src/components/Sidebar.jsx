import React from 'react';
import { useDispatch } from 'react-redux';
import { setDraggingField } from '../redux/actions';
const FIELD_TYPES = [
  { type: 'Name (First, Last)', icon: 'fas fa-user' },
  { type: 'Email', icon: 'fas fa-envelope' },
  { type: 'Contact Number', icon: 'fas fa-phone' },
  { type: 'Short Answer', icon: 'fas fa-text-width' },
  { type: 'Paragraph', icon: 'fas fa-align-left' },
  { type: 'Radio Button', icon: 'fas fa-dot-circle' },
  { type: 'Checkbox', icon: 'fas fa-check-square' },
];
const Sidebar = () => {
  const dispatch = useDispatch();
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', fieldType);
    dispatch(setDraggingField(fieldType));
  };
  const handleDragEnd = () => {
    dispatch(setDraggingField(null));
  };
  return (
    <div className="sidebar">
      <h2>Field Palette</h2>
      <div className="field-palette">
        {FIELD_TYPES.map((field) => (
          <div
            key={field.type}
            className="palette-item"
            draggable
            onDragStart={(e) => handleDragStart(e, field.type)}
            onDragEnd={handleDragEnd}
          >
            <i className={field.icon}></i>
            <span>{field.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;