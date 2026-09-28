export default function PostListSkeleton() {
  return (
    <ul className="flex flex-col gap-1">
      {Array.from({ length: 26 }).map((_, i) => (
        <li key={i} className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg bg-base-stroke px-1.5 py-2 pc:p-2">
          <p className="h-5 w-full"></p>
        </li>
      ))}
    </ul>
  );
}
