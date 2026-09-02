// UserStatusToggle.jsx
import { Switch } from "@chakra-ui/react";

const UserStatusToggle = ({ active, onChange }) => {
  return <Switch isChecked={active} onChange={onChange} />;
};

export default UserStatusToggle;
