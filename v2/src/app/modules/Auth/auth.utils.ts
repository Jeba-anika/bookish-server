import { User } from "../user/user.model";

const findLastId = async (role: string) => {
  if (role === "buyer") {
    const lastBuyer = await User.findOne(
      {
        role: "buyer",
      },
      { id: 1, _id: 0 }
    )
      .sort({
        createdAt: -1,
      })
      .lean();
    return lastBuyer?.id ? lastBuyer.id.substring(2) : undefined;
  } else if (role === "seller") {
    const lastSeller = await User.findOne(
      {
        role: "seller",
      },
      { id: 1, _id: 0 }
    )
      .sort({
        createdAt: -1,
      })
      .lean();
    return lastSeller?.id ? lastSeller.id.substring(2) : undefined;
  } else if (role === "admin") {
    const lastAdmin = await User.findOne(
      {
        role: "admin",
      },
      { id: 1, _id: 0 }
    )
      .sort({
        createdAt: -1,
      })
      .lean();
    return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
  }
};
export const generateId = async (role: string) => {
  const lastId = await findLastId(role);
  let currentId = (0).toString();
  if (lastId) {
    currentId = lastId.substring(2);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  if (role === "buyer") {
    incrementId = `B-${incrementId}`;
    return incrementId;
  } else if (role === "seller") {
    incrementId = `S-${incrementId}`;
    return incrementId;
  } else if (role === "admin") {
    incrementId = `A-${incrementId}`;
    return incrementId;
  }
};
