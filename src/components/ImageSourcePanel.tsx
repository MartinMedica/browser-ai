import type { SelectedImage } from "@/types/image";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Gallery } from "@/components/Gallery"

function InputFile(
  { workerFailed, handleImageSelected }
    : {
      workerFailed: boolean,
      handleImageSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
    }) {
  return (<Field>
    <Input id="image" disabled={workerFailed} type='file' accept='image/*' onChange={handleImageSelected} />
    <FieldDescription>Select an image to analyze</FieldDescription>
  </Field>)
}

type ImageSourcePanelProps = {
  selectedImage: SelectedImage | null;
  handleSampleSelection: (img: string) => void;
  workerFailed: boolean;
  handleImageSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ImageSourcePanel({ selectedImage, handleImageSelected, workerFailed, handleSampleSelection }: ImageSourcePanelProps) {
  return (<>
    <Gallery selectedImageUrl={selectedImage?.previewUrl} handleSampleSelection={handleSampleSelection} />
    <div>
      <InputFile workerFailed={workerFailed} handleImageSelected={handleImageSelected} />
    </div>
  </>)
}
