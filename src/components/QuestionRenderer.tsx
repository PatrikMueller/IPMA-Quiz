import { RichTextContent } from '@/types/quiz';

interface QuestionRendererProps {
  content: RichTextContent[];
  className?: string;
}

export default function QuestionRenderer({ content, className = "" }: QuestionRendererProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {content.map((item, index) => (
        <RichContentItem key={index} content={item} />
      ))}
    </div>
  );
}

function RichContentItem({ content }: { content: RichTextContent }) {
  switch (content.type) {
    case 'text':
      return (
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {content.value}
        </p>
      );

    case 'image':
      return (
        <div className="my-4">
          <img
            src={content.src}
            alt={content.alt || 'Question image'}
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            loading="lazy"
            onError={(e) => {
              // Handle broken images gracefully
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 text-center';
                errorMsg.textContent = `Image not available: ${content.alt || 'Question image'}`;
                parent.appendChild(errorMsg);
              }
            }}
          />
          {content.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
              {content.caption}
            </p>
          )}
        </div>
      );

    case 'video':
      return (
        <div className="my-4">
          <video
            src={content.src}
            controls
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            onError={(e) => {
              // Handle broken videos gracefully
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 text-center';
                errorMsg.textContent = `Video not available: ${content.caption || 'Question video'}`;
                parent.appendChild(errorMsg);
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
          {content.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
              {content.caption}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          Unsupported content type: {(content as any).type}
        </div>
      );
  }
}
