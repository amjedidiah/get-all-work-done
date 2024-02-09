import { getWorld } from '@get-all-work-done/shared/utils';

const name = getWorld();
export default async function Index() {
  return <div className="">Hello {name}</div>;
}
