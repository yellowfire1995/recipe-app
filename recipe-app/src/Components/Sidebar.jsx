import React, { useState, useRef, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
// import { getAllIds, changeActive } from "../../trash/filters.js";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { useLoaderData, useSubmit, useFetcher } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SearchCheckboxList from "./searchcheckboxlist.jsx";

export default function Sidebar(props) {
  const cuisines = props.cuisines;
  return (
    <>
      <SearchCheckboxList title="Cuisines" list={cuisines} />
    </>
  );
}

// export default function Sidebar(props) {

//   return (
//     <>
//       <div className="sticky-top">
//         <h1 className="h4">Filters</h1>
//         <Accordion className="border-0">
//           {activeAllIds[0].childIds.map((id) => (
//             <PlaceTree
//               key={id}
//               id={id}
//               parentId={0}
//               headersById={activeAllIds}
//             />
//           ))}
//         </Accordion>
//       </div>
//     </>
//   );
// }

// function PlaceTree({ id, parentId, headersById, onSelect }) {
//   const header = headersById[id];
//   const childIds = header.childIds;
//   const submit = useSubmit();
//   const fetcher = useFetcher();

//   return (
//     <div className="sticky-top">
//       <AccordionHeader>{header.title}</AccordionHeader>
//       <AccordionBody>
//         <ListGroup variant="flush" className="justify-content-evenly">
//           {childIds.map((childId) => {
//             return (
//               <fetcher.Form>
//                 <Form.Check
//                   id={childId}
//                   key={childId}
//                   checked={headersById[childId].active}
//                   onClick={(event) =>
//                     submit(event.target.id, { method: "post", action: "/" })
//                   }
//                   label={`${headersById[childId].title}`}
//                 />
//               </fetcher.Form>
//             );
//           })}
//         </ListGroup>
//       </AccordionBody>
//     </div>
//   );
// }
