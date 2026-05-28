export const cx = (...args: (string | false | null | undefined)[]) =>
  args.filter(Boolean).join(' ');
