import Loading from "./Loading.jsx";
import SearchCheckboxList from "./searchcheckboxlist.jsx";
import { useQuery } from "@tanstack/react-query";

export default function Sidebar(props) {
  const sidebarQuery = useQuery({
    queryKey: ["sidebar"],
    queryFn: props.fetcher,
  });

  if (sidebarQuery.isPending) {
    return <Loading />;
  }

  return <SearchCheckboxList title="Cuisines" list={sidebarQuery.data} />;
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
