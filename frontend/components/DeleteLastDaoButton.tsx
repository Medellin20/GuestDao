import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";

interface DeleteLastDaoButtonProps {
  onDeleted: (deletedId: string) => void;
  disabled?: boolean;
  hasDaos: boolean;
}

export default function DeleteLastDaoButton({
  onDeleted,
  disabled,
  hasDaos,
}: DeleteLastDaoButtonProps) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isAdmin()) return null;

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const result = await apiService.deleteLastDao();
      onDeleted(result.deletedId);
    } catch (e) {
      console.error("Suppression échouée:", e);
      alert(
        e instanceof Error
          ? e.message
          : "Impossible de supprimer ce DAO pour le moment.",
      );
      throw e;
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="destructive"
          size="sm"
          className="w-full xs:w-auto lg:w-28"
          disabled={disabled || processing || !hasDaos}
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      }
      title="Supprimer ?"
      description={
        hasDaos
          ? "Cette action supprimera définitivement ce DAO. Opération irréversible."
          : "Aucun DAO à supprimer."
      }
      confirmText={processing ? "En cours..." : "Supprimer"}
      cancelText="Annuler"
      onConfirm={handleConfirm}
      variant="destructive"
      icon="trash"
      open={open}
      onOpenChange={setOpen}
      disabled={!hasDaos}
    />
  );
}
