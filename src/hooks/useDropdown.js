import { useState, useEffect } from "react";

function useDropdown(ref, closeOnClickOutside = true) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [current, setCurrent] = useState();

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleChoice = (choice) => {
    setCurrent(choice);
    setIsDropdownOpen(false);
  };

  // Close dropdown if clicking outside
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener to close the dropdown on outside click when it is open.
  useEffect(() => {
    if (!closeOnClickOutside) return;
    if (!isDropdownOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    closeDropdown,
    current,
    handleChoice,
  };
}

export default useDropdown;
