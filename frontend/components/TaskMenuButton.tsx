import { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import TaskEditDialog from "./TaskEditDialog";
import { useAuth } from "@/contexts/AuthContext";
import type { DaoTask, TeamMember } from "@shared/dao";

interface TaskMenuButtonProps {
  task: DaoTask;
  onTaskUpdate: (taskId: number, updates: Partial<DaoTask>) => void;
  onTaskDelete: (taskId: number) => void;
  canManage?: boolean;
  availableMembers?: TeamMember[];
}

export default function TaskMenuButton({
  task,
  onTaskUpdate,
  onTaskDelete,
  canManage = false,
  availableMembers = [],
}: TaskMenuButtonProps) {
  const { isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Show for admin or manager (team lead)
  if (!isAdmin() && !canManage) {
    return null;
  }

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    console.log(
      `🗑️ Ouverture du dialogue de confirmation pour supprimer la tâche: "${task.name}"`,
    );
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log(`�� Confirmation de suppression de la tâche: "${task.name}"`);
    onTaskDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleTaskUpdate = (updates: Partial<DaoTask>) => {
    onTaskUpdate(task.id, updates);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted/50"
            aria-label="Actions de la tâche"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier la tâche
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer la tâche
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <TaskEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
        onSave={handleTaskUpdate}
        availableMembers={availableMembers}
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Supprimer la tâche"
        description={`Voulez-vous vraiment supprimer la tâche "${task.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={confirmDelete}
        variant="destructive"
        icon="trash"
      />
    </>
  );
}
