import { Button } from "../../components/ui/button";

const NotesTab = ({ notes, setNotes, onSaveNotes }) => {
  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Enter your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={onSaveNotes}>Save Notes</Button>
      </div>
    </div>
  );
};

export default NotesTab;
