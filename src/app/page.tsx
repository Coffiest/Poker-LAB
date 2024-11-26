"use client";

import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import styles from "./Home.module.css";

interface User {
  id: string;
  name: string;
  chips: number;
  rank: number;
  password: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, orderBy("rank"));
    const userSnapshot = await getDocs(userQuery);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
    setUsers(userList);
  };

  const deleteUser = async (id: string) => {
    const adminPassword = prompt("管理者情報を入力してください");
    if (adminPassword === "123") {
      const confirmation = window.confirm("本当に削除しますか？");
      if (confirmation) {
        await deleteDoc(doc(db, "users", id));
        fetchUsers();
      }
    } else {
      alert("管理者認証に失敗しました");
    }
  };

  const handleTransaction = async (
    id: string,
    action: "withdraw" | "deposit"
  ) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const userPassword = prompt("パスワードを入力してください");
    if (userPassword !== user.password) {
      alert("パスワードが間違っています");
      return;
    }

    const amount = Number(
      prompt(action === "withdraw" ? "いくら引き出しますか？" : "いくら預けますか？")
    );
    if (isNaN(amount) || amount <= 0) {
      alert("無効な金額です");
      return;
    }

    const newChips =
      action === "withdraw" ? user.chips - amount : user.chips + amount;
    if (newChips < 0) {
      alert("チップが不足しています");
      return;
    }

    await updateDoc(doc(db, "users", id), { chips: newChips });
    fetchUsers();
  };

  const addUser = async () => {
    const name = prompt("名前を入力してください");
    const chips = Number(prompt("初期チップを入力してください"));
    const password = prompt("パスワードを設定してください");
    if (!name || isNaN(chips) || !password) {
      alert("無効な入力です");
      return;
    }

    await addDoc(collection(db, "users"), { name, chips, rank: 0, password });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>Poker Labo</div>
        <button className={styles.user_add_button} onClick={addUser}>
          ユーザーを追加
        </button>
      </header>
      <main className={styles.main}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>名前</th>
              <th className={styles.th}>チップ</th>
              <th className={styles.th}>順位</th>
              <th className={styles.th}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className={styles.td}>{user.name}</td>
                <td className={styles.td}>{user.chips}</td>
                <td className={styles.td}>{user.rank}</td>
                <td className={styles.td}>
                  <button
                    className={styles.button}
                    onClick={() => handleTransaction(user.id, "withdraw")}
                  >
                    引き出す
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleTransaction(user.id, "deposit")}
                  >
                    預ける
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => deleteUser(user.id)}
                  >
                    ユーザーを削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className={styles.footer}>Poker Labo - 2024</footer>
    </div>
  );
};

export default Home;