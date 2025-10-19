import { useState, useCallback, useRef } from 'react';
import { useProfilePhotos, ProfilePhoto } from '@/hooks/useProfilePhotos';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  Move,
  Trash2,
  Star,
  StarOff,
  AlertCircle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PhotoUploaderProps {
  className?: string;
  onPhotosChange?: () => void;
}

interface SortablePhotoItemProps {
  photo: ProfilePhoto;
  index: number;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

const SortablePhotoItem = ({ photo, index, onDelete, onSetPrimary }: SortablePhotoItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getModerationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getModerationStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      case 'flagged':
        return 'Signalée';
      case 'pending':
      default:
        return 'En attente';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50 z-10"
      )}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            {/* Photo */}
            <img
              src={photo.file_path}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Primary badge */}
            {photo.is_primary && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Principal
              </Badge>
            )}

            {/* Moderation status */}
            <Badge
              className={cn(
                "absolute top-2 right-2 text-xs",
                getModerationStatusColor(photo.moderation_status || 'pending')
              )}
            >
              {photo.moderation_status === 'approved' && <Check className="w-3 h-3 mr-1" />}
              {photo.moderation_status === 'rejected' && <X className="w-3 h-3 mr-1" />}
              {photo.moderation_status === 'flagged' && <AlertCircle className="w-3 h-3 mr-1" />}
              {getModerationStatusText(photo.moderation_status || 'pending')}
            </Badge>

            {/* Order indicator */}
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-black/70 text-white text-xs rounded-full flex items-center justify-center">
              {photo.display_order}
            </div>

            {/* Action buttons */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {/* Drag handle */}
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                {...attributes}
                {...listeners}
              >
                <Move className="w-4 h-4" />
              </Button>

              {/* Set as primary */}
              {!photo.is_primary && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => onSetPrimary(photo.id)}
                >
                  <StarOff className="w-4 h-4" />
                </Button>
              )}

              {/* Delete */}
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-red-500/20"
                onClick={() => onDelete(photo.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Rejection reason */}
            {photo.moderation_status === 'rejected' && photo.rejection_reason && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs p-2">
                <p className="truncate">{photo.rejection_reason.join(', ')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const PhotoUploader = ({ className, onPhotosChange }: PhotoUploaderProps) => {
  const {
    photos,
    loading,
    uploading,
    uploadProgress,
    maxPhotos,
    canUploadMore,
    uploadMultiplePhotos,
    reorderPhotos,
    deletePhoto,
    setPrimaryPhoto,
    loadPhotos
  } = useProfilePhotos();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    await uploadMultiplePhotos(fileArray);
    onPhotosChange?.();
  }, [uploadMultiplePhotos, onPhotosChange]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Handle photo reordering
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex(photo => photo.id === active.id);
      const newIndex = photos.findIndex(photo => photo.id === over.id);

      const newPhotos = arrayMove(photos, oldIndex, newIndex);
      const newOrder = newPhotos.map((photo, index) => ({
        photoId: photo.id,
        newOrder: index + 1
      }));

      await reorderPhotos(newOrder);
      onPhotosChange?.();
    }
  }, [photos, reorderPhotos, onPhotosChange]);

  // Handle photo deletion
  const handleDelete = useCallback(async (photoId: string) => {
    await deletePhoto(photoId);
    onPhotosChange?.();
  }, [deletePhoto, onPhotosChange]);

  // Handle set primary
  const handleSetPrimary = useCallback(async (photoId: string) => {
    await setPrimaryPhoto(photoId);
    onPhotosChange?.();
  }, [setPrimaryPhoto, onPhotosChange]);

  const activePhotos = photos.filter(photo => photo.is_active);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className={cn(
              "rounded-full p-4 mb-4 transition-colors",
              dragOver ? "bg-primary/10" : "bg-muted"
            )}>
              <Upload className={cn(
                "w-8 h-8",
                dragOver ? "text-primary" : "text-muted-foreground"
              )} />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Ajoutez vos photos
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Glissez-déposez vos photos ici ou cliquez pour parcourir
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>• Maximum {maxPhotos} photos</span>
              <span>• JPEG, PNG, WebP acceptés</span>
              <span>• Maximum 10MB par photo</span>
              <span>• Minimum 200x200 pixels</span>
            </div>

            <Button
              variant="outline"
              className="mt-4"
              disabled={uploading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Choisir des photos
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Upload en cours...</h4>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos Grid */}
      {activePhotos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Vos photos ({activePhotos.length}/{maxPhotos})
            </h3>
            <div className="text-sm text-muted-foreground">
              Glissez-déposez pour réorganiser
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activePhotos.map(photo => photo.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activePhotos.map((photo, index) => (
                  <SortablePhotoItem
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onDelete={handleDelete}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}

                {/* Add more photos placeholder */}
                {canUploadMore && (
                  <Card
                    className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Ajouter</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Empty State */}
      {activePhotos.length === 0 && !uploading && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune photo</h3>
          <p className="text-muted-foreground mb-4">
            Ajoutez vos premières photos pour rendre votre profil attractif
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter des photos
          </Button>
        </div>
      )}

      {/* Photo Tips */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseils pour de meilleures photos</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Utilisez un bon éclairage naturel</li>
            <li>• Montrez votre visage clairement sur la première photo</li>
            <li>• Variez les angles et les environnements</li>
            <li>• Évitez les photos floues ou de mauvaise qualité</li>
            <li>• Soyez authentique et souriant</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};