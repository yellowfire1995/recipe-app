import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { editCollection } from "../../../db/queries";
import { queryClient } from "../../main";

export default function MakePublicIcon(props) {
  const navigate = useNavigate();
  const collection = props.collection;

  const edit = useMutation({
    mutationFn: () => {
      return editCollection({
        collection: { ...collection, public: !collection.public },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["Collections"] }),
        queryClient.invalidateQueries({ queryKey: ["publicCollections"] }),
      ]);
    },
    onSettled: async () => {
      navigate(`/collections`);
    },
  });

  return collection.public ? (
    <Visibility
      className="my-auto icon-interactive"
      fontSize="large"
      onClick={edit.mutate}
    />
  ) : (
    <VisibilityOff
      className="my-auto icon-interactive"
      fontSize="large"
      onClick={edit.mutate}
    />
  );
}
