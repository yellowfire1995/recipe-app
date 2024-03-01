import { useState } from "react";
import Form from "react-bootstrap/Form";
import _ from "lodash";
import { Container } from "@mui/material";

export default function SearchCheckboxList(props) {
  const title = props.title;
  const list = _.map(props.list, (element) => {
    return _.extend({}, element, { active: false });
  });
  const [search, setSearch] = useState("");
  const [searchedList, setSearchedList] = useState(list);
  const [activeList, setActiveList] = useState([]);

  const handleClick = (event, label) => {
    if (_.find(activeList, { id: event.target.id })) {
      setActiveList(_.filter(activeList, (o) => o.id != event.target.id));
      const objIndex = _.findIndex(
        searchedList,
        (obj) => obj.id === event.target.id
      );

      setSearchedList([
        ...searchedList,
        (searchedList[objIndex].active = !searchedList[objIndex].active),
      ]);
    } else {
      setActiveList([...activeList, { id: event.target.id, label: label }]);
      const objIndex = _.findIndex(
        searchedList,
        (obj) => obj.id == event.target.id
      );
      setSearchedList([
        ...searchedList,
        (searchedList[objIndex].active = !searchedList[objIndex].active),
      ]);
    }
  };

  return (
    <>
      <h1>{title}</h1>
      <Container>
        {activeList.map((item) => (
          <div key={item.id}>{item.label} </div>
        ))}
      </Container>

      <Form>
        <input
          type="textbox"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearchedList(
              _.filter(searchedList, (item) =>
                item.label.toUpperCase().includes(e.target.value.toUpperCase())
              )
            );
            setSearch(e.target.value);
          }}
        />
        {searchedList.map((item) => (
          <Form.Check // prettier-ignore
            type="checkbox"
            key={item.id}
            id={item.id}
            label={item.label}
            checked={item.active}
            onChange={(e) => handleClick(e, item.label, activeList)}
          />
        ))}
      </Form>
    </>
  );
}
