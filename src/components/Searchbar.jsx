import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";

const Searchbar = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const [active, setActive] = useState(-1);

  const inputRef = useRef();

  useEffect(() => {
    const searchedUsers = async () => {
      const { data } = await axios.get(
        `https://dummyjson.com/users/search?q=${searchedTerm}`
      );
      setSuggestions(data);
    };
    searchedUsers();
    console.log(suggestions);
  }, [searchedTerm]);

  const handleSelectUser = (user) => {
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSelectedUser([...selectedUser, user]);
    console.log(selectedUser);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updatedUser = selectedUser.filter((usr) => usr.email != user.email);
    setSelectedUser(updatedUser);
    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(new Set(updatedEmails));
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const lastUser = selectedUser[selectedUser.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActive((prevIndex) =>
        prevIndex < suggestions.users.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActive((prevIndex) => (prevIndex >=0 ? prevIndex - 1 : prevIndex));
    } else if (
      e.key === "Enter" &&
      active >= 0 &&
      active < suggestions.users.length
    ) {
      handleSelectUser(suggestions.users[active]);
      setActive(-1);
    }
  };
  return (
    <div className="mx-2 my-3 border border-slate-400 flex  relative ">
      <div className="flex w-full p-2 gap-2 flex-wrap items-center ">
        {selectedUser?.map((user) => (
          <div
            key={user.email}
            className="flex gap-1 bg-green-200 border rounded-md ring "
          >
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="object-contain w-4 "
            />
            <span>
              {user.firstName} {user.lastName}
            </span>
            <span
              className="cursor-pointer"
              onClick={() => handleRemoveUser(user)}
            >
              &#10539;
            </span>
          </div>
        ))}
        <div className="w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search query..."
            className="outline-none px-1 flex"
            value={searchedTerm}
            onChange={(e) => setSearchedTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute mt-4 overflow-y-scroll h-48">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <div
                  key={user.id}
                  className={`flex gap-1 cursor-pointer hover:bg-gray-200 ${
                    index == active ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    handleSelectUser(user);
                  }}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-contain w-4 "
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
