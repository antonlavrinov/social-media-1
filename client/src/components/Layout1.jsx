// import React, { useContext, useState } from "react";
// import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
// import Drawer from "@material-ui/core/Drawer";
// import AppBar from "@material-ui/core/AppBar";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Toolbar from "@material-ui/core/Toolbar";
// import List from "@material-ui/core/List";
// import Typography from "@material-ui/core/Typography";
// import Divider from "@material-ui/core/Divider";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
// import Header from "./Header";
// import { Avatar, Container } from "@material-ui/core";
// import { useStyles } from "./useStyles";
// import SearchIcon from "@material-ui/icons/Search";
// import InputBase from "@material-ui/core/InputBase";
// import { useHttp } from "../hooks/useHttp";
// import { AuthContext } from "../context/AuthContext";
// import MenuItem from "@material-ui/core/MenuItem";
// import Menu from "@material-ui/core/Menu";
// import IconButton from "@material-ui/core/IconButton";
// import Badge from "@material-ui/core/Badge";
// import AccountCircle from "@material-ui/icons/AccountCircle";
// import NotificationsIcon from "@material-ui/icons/Notifications";
// import MoreIcon from "@material-ui/icons/MoreVert";
// import { Link, useHistory } from "react-router-dom";
// import Search from "./Search";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const classes = useStyles();

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [
//     mobileMoreAnchorEl,
//     setMobileMoreAnchorEl,
//   ] = React.useState<null | HTMLElement>(null);
//   // const [testValue, setTestValue] = useState(0);

//   const { logout, meUserData } = useContext(AuthContext);
//   const { request } = useHttp();
//   const history = useHistory();

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   console.log("Layout updated");

//   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };

//   const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const handleLogOut = async () => {
//     try {
//       // console.log(credentials);
//       await request("/api/auth/logout", "POST");

//       logout();
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleEditProfile = () => {
//     history.push(`/profile/edit/${meUserData?._id}`);
//     setAnchorEl(null);
//   };
//   // console.log("history", history);

//   const menuId = "primary-search-account-menu";
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
//       <MenuItem onClick={handleEditProfile}>Редактировать профиль</MenuItem>
//       <MenuItem onClick={handleLogOut}>Выйти</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = "primary-search-account-menu-mobile";
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       {/* <MenuItem>
//         <IconButton aria-label="show 4 new mails" color="inherit">
//           <Badge badgeContent={4} color="secondary">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem> */}
//       {/* <MenuItem>
//         <IconButton aria-label="show 11 new notifications" color="inherit">
//           <Badge badgeContent={11} color="secondary">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem> */}
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           {/* <AccountCircle /> */}
//           <Avatar alt="avatar" src={meUserData?.avatar} />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="h6" noWrap>
//             VK clone
//           </Typography>
//           <Search />
//           <div className={classes.grow} />
//           <div className={classes.sectionDesktop}>
//             {/* <IconButton aria-label="show 4 new mails" color="inherit">
//               <Badge badgeContent={4} color="secondary">
//                 <MailIcon />
//               </Badge>
//             </IconButton>
//             <IconButton aria-label="show 17 new notifications" color="inherit">
//               <Badge badgeContent={17} color="secondary">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton> */}
//             <IconButton
//               edge="end"
//               aria-label="account of current user"
//               aria-controls={menuId}
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               // color="inherit"
//             >
//               {/* <AccountCircle /> */}
//               <Avatar alt="avatar" src={meUserData?.avatar}>
//                 {!meUserData?.avatar && meUserData?.firstName?.[0]}
//               </Avatar>
//             </IconButton>
//           </div>

//           <div className={classes.sectionMobile}>
//             <IconButton
//               aria-label="show more"
//               aria-controls={mobileMenuId}
//               aria-haspopup="true"
//               onClick={handleMobileMenuOpen}
//               color="inherit"
//             >
//               <MoreIcon />
//             </IconButton>
//           </div>
//           {renderMobileMenu}
//           {renderMenu}
//         </Toolbar>
//       </AppBar>
//       {/* <Header /> */}
//       {/* <Container maxWidth="md"> */}
//       <Drawer
//         className={classes.drawer}
//         variant="permanent"
//         classes={{
//           paper: classes.drawerPaper,
//         }}
//       >
//         <Toolbar />
//         <div className={classes.drawerContainer}>
//           <List>
//             {[
//               { title: "Profile", slug: `/profile/${meUserData?._id}` },
//               { title: "Messages", slug: "/messages" },
//               { title: "Friends", slug: `/friends/${meUserData?._id}` },
//             ].map((item, index) => (
//               <Link to={item.slug} key={item.title}>
//                 <ListItem button>
//                   <ListItemIcon>
//                     {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                   </ListItemIcon>
//                   <ListItemText primary={item.title} />
//                 </ListItem>
//               </Link>
//             ))}
//           </List>
//           <Divider />
//         </div>
//       </Drawer>
//       {/* <button onClick={() => setTestValue(testValue + 1)}>{testValue}</button> */}
//       <main className={classes.content}>
//         <Toolbar />

//         {children}
//         {/* <Typography paragraph></Typography> */}
//       </main>
//     </div>
//   );
// };

// export default Layout;
