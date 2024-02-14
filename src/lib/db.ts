import User from "@/db/models/user";
import { AccountWithCredit } from "@/types";

const handleUpdateUserCredit = async (credit: number, accountId: string) =>
  User.increment({ credit }, { where: { accountId } });

export const addUsersCredit = async (users: AccountWithCredit[]) => {
  for (const user of users)
    await handleUpdateUserCredit(user.credit, user.accountId);
};
