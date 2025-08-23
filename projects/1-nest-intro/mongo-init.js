// 用户创建mongo容器时，初始化普通用户，内容待定
db.createUser({
  user: 'devuser',
  pwd: 'devpassword',
  roles: [{ role: 'readWrite', db: 'mydb' }],
});
