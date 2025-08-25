import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import * as React from "react";

export interface ImageProps extends React.ComponentProps<typeof Avatar> {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  preview?: boolean;
  imageClassName?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback,
  preview = false,
  className,
  imageClassName = "object-cover",
  ...avatarProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const avatar = (
    <Avatar className={className} {...avatarProps}>
      <AvatarImage
        src={imgError ? undefined : src}
        alt={alt}
        className={imageClassName}
        onError={() => setImgError(true)}
      />
      <AvatarFallback className="font-semibold uppercase">
        {fallback || (alt ? alt[0] + alt[1] : "?")}
      </AvatarFallback>
    </Avatar>
  );

  if (!preview || !src) return avatar;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer" asChild>
        {avatar}
      </DialogTrigger>
      <DialogContent className="flex flex-col border-none bg-transparent items-center justify-center w-fit max-w-md p-0">
        <div className=" w-full flex items-center justify-center ">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[70vh] rounded-lg "
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
