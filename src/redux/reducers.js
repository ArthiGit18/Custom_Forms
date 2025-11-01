import {
  ADD_FIELD,
  UPDATE_FIELD,
  REMOVE_FIELD,
  SET_DRAGGING_FIELD,
} from './actions';
export const REORDER_FIELDS = 'REORDER_FIELDS';
const createNewField = (type, id) => {
  const base = {
    id: `field-${id}`,
    type: type,
    required: false,
  };
  switch (type) {
    case 'Name (First, Last)':
      return {
        ...base,
        label: 'Full Name',
        value: { first: '', last: '' },
        subFields: [ 
          { key: 'first', label: 'First Name', placeholder: 'Enter first name', required: true },
          { key: 'last', label: 'Last Name', placeholder: 'Enter last name', required: true },
        ]
      };
    case 'Email':
      return { ...base, label: 'Email Address', placeholder: 'example@domain.com', inputType: 'email', required: true, value: '' }; 
    case 'Contact Number':
      return { ...base, label: 'Phone Number', placeholder: '(999) 999-9999', inputType: 'tel', required: true, value: '' };
    case 'Short Answer':
      return { ...base, label: `Short Answer ${id}`, placeholder: 'Enter short answer', inputType: 'text', value: '' };
    case 'Paragraph':
      return { ...base, label: `Paragraph ${id}`, placeholder: 'Enter paragraph text', inputType: 'textarea', value: '' };
    case 'Radio Button':
    case 'Checkbox':
      return {
        ...base,
        label: `${type} Field ${id}`,
        options: [
          { value: 'Option 1', label: 'Option 1' },
          { value: 'Option 2', label: 'Option 2' },
        ],
      };
    default:
      return base;
  }
};
const initialState = {
 formFields: [
      createNewField('Name (First, Last)', 1),
      createNewField('Email', 2),
      createNewField('Contact Number', 3),
  ],
  draggingFieldType: null,
  nextFieldId: 4,
};
export const formBuilderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FIELD: {
      const { type, positionIndex } = action.payload;
      const newField = createNewField(type, state.nextFieldId);
      const newFields = [...state.formFields];
      if (positionIndex !== undefined && positionIndex >= 0) {
        newFields.splice(positionIndex, 0, newField);
      } else {
        newFields.push(newField);
      }
      return {
        ...state,
        formFields: newFields,
        nextFieldId: state.nextFieldId + 1,
      };
    }
    case UPDATE_FIELD:
      return {
        ...state,
        formFields: state.formFields.map((field) =>
          field.id === action.payload.id
            ? { ...field, ...action.payload.updates }
            : field
        ),
      };
    case REMOVE_FIELD:
      return {
        ...state,
        formFields: state.formFields.filter(
          (field) => field.id !== action.payload
        ),
      };
    case SET_DRAGGING_FIELD:
      return {
        ...state,
        draggingFieldType: action.payload,
      };
      case REORDER_FIELDS: {
      const { sourceIndex, destinationIndex } = action.payload;
      if (destinationIndex === undefined || sourceIndex === destinationIndex) {
        return state;
      }
      const newFields = Array.from(state.formFields);
      const [movedField] = newFields.splice(sourceIndex, 1);
      newFields.splice(destinationIndex, 0, movedField);
      return {
        ...state,
        formFields: newFields,
      };
    }
    default:
      return state;
  }
};