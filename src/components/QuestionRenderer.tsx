import { RichTextContent } from '@/types/quiz';
import ImageViewer from './media/ImageViewer';
import OptimizedVideo from './media/OptimizedVideo';

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
          <ImageViewer
            src={content.src || ''}
            alt={content.alt || 'Question image'}
            caption={content.caption}
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            loading="lazy"
          />
        </div>
      );

    case 'video':
      return (
        <div className="my-4">
          <OptimizedVideo
            src={content.src || ''}
            caption={content.caption}
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            loading="lazy"
          />
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
