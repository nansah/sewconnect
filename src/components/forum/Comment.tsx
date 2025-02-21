
interface CommentProps {
  author: string;
  content: string;
  createdAt: string;
  formatDate: (date: string) => string;
}

export const Comment = ({ author, content, createdAt, formatDate }: CommentProps) => {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm">
          {author[0]?.toUpperCase()}
        </div>
        <div>
          <span className="font-medium text-sm">{author}</span>
          <span className="text-xs text-gray-500 ml-2">{formatDate(createdAt)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 ml-10">{content}</p>
    </div>
  );
};
