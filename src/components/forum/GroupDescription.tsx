
interface GroupDescriptionProps {
  description: string;
}

export const GroupDescription = ({ description }: GroupDescriptionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">About This Group</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
