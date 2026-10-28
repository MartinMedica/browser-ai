import catImageUrl from "@/assets/cat.webp";
import dogImageUrl from "@/assets/dog.webp";
import horseImageUrl from "@/assets/horse.webp";

const PreviewImage = ({
  src,
  alt,
  selectedImageUrl,
  handleSampleSelection,
}: {
  src: string;
  alt: string;
  selectedImageUrl?: string;
  handleSampleSelection: (img: string) => void;
}) => {
  return (
    <button
      onClick={() => handleSampleSelection(src)}
      type="button"
      aria-pressed={selectedImageUrl === src}
      className="focus-visible:outline-offset rounded focus-visible:outline-2 focus-visible:outline-ring"
    >
      <img
        src={src}
        alt={alt}
        className={`aspect-square rounded object-cover hover:opacity-100 ${selectedImageUrl === src ? "opacity-100" : "opacity-60"}`}
      />
    </button>
  );
};

export function Gallery({
  selectedImageUrl,
  handleSampleSelection,
}: {
  selectedImageUrl?: string;
  handleSampleSelection: (url: string) => void;
}) {
  return (
    <div className="mb-2 grid min-h-0 grid-cols-1 gap-1 md:grid-cols-4">
      <div className="grid grid-cols-3 gap-1 md:grid-cols-1 md:grid-rows-3">
        <PreviewImage
          src={catImageUrl}
          alt="Sample image of a cat"
          selectedImageUrl={selectedImageUrl}
          handleSampleSelection={handleSampleSelection}
        />
        <PreviewImage
          src={dogImageUrl}
          alt="Sample image of a dog"
          selectedImageUrl={selectedImageUrl}
          handleSampleSelection={handleSampleSelection}
        />
        <PreviewImage
          src={horseImageUrl}
          alt="Sample image of a horse"
          selectedImageUrl={selectedImageUrl}
          handleSampleSelection={handleSampleSelection}
        />
      </div>
      <div className="md:col-span-3">
        {selectedImageUrl ? (
          <img
            src={selectedImageUrl}
            alt="Image being analyzed"
            className="aspect-square w-full rounded object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium">Select an image</p>
            <p className="text-sm text-muted-foreground">
              Choose an image from the left or update one to preview it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
