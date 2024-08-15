import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogIn } from 'react-icons/fi';
import { GoSignOut } from 'react-icons/go';
import styles from './Nav.module.scss';
import NavCartBlock from './nav-cart-block/NavCartBlock';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAuth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { removeUser } from '../../../store/user/userSlice';

function Nav() {
  const { products } = useSelector((state) => state.cartSlice);
  const { isAuthenticated } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const auth = getUserAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <div className={styles.counter}>
            <Link to={"/cart"}>
              <FiShoppingCart />
            </Link>
            {products.length > 0 && <b>{products.length}</b>}
            {/* 카트의 갯수 */}

            {products.length > 0 && (
              <div className={styles.nav_hover_cart}>
                <NavCartBlock />
              </div>
            )}
          </div>
        </li>
        <li>
          <div>
            <Link>
              <FiUser />
            </Link>
          </div>
        </li>
        <li>
          <div>
            <Link>
              <FiLogIn />
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
