import bcrypt from "bcryptjs";

const password = "123456";
const hashedPassword = bcrypt.hash(password, 10);
console.log(hashedPassword);

bcrypt.compare(password, hashedPassword).then((result) => {
  console.log(result ? "Password matches ✅" : "Password does not match ❌");
});
