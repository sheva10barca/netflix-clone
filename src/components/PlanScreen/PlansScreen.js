import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

import { loadStripe } from '@stripe/stripe-js';

import './PlansScreen.css';
import db from '../../firebase';

function PlansScreen() {
   const [products, setProducts] = useState([]);
   const user = useSelector(selectUser);
   const [subsciption, setSubscription] = useState(null);

   useEffect(() => {
      db.collection('customers')
         .doc(user.uid)
         .collection('subscriptions')
         .get()
         .then((querySnapshot) => {
            querySnapshot.forEach(async (subsciption) => {
               setSubscription({
                  role: subsciption.data().role,
                  current_period_end: subsciption.data().current_period_end.seconds,
                  current_period_start: subsciption.data().current_period_start.seconds,
               });
            });
         });
   }, [user.uid]);

   useEffect(() => {
      db.collection('products')
         .where('active', '==', true)
         .get()
         .then((querySnapshot) => {
            const products = {};
            querySnapshot.forEach(async (productDoc) => {
               products[productDoc.id] = productDoc.data();
               const priceSnap = await productDoc.ref.collection('prices').get();
               priceSnap.docs.forEach((price) => {
                  products[productDoc.id].prices = {
                     priceId: price.id,
                     priceData: price.data(),
                  };
               });
            });
            setProducts(products);
         });
   }, []);
   console.log(subsciption);

   const loadCheckout = async (priceId) => {
      const docRef = await db.collection('customers').doc(user.uid).collection('checkout_sessions').add({
         price: priceId,
         success_url: window.location.origin,
         cancel_url: window.location.origin,
      });

      docRef.onSnapshot(async (snap) => {
         const { error, sessionId } = snap.data();
         // show an error to customer and
         // inspect your cloud functions logs in firebase console
         if (error) {
            alert(`An error occured: ${error.message}`);
         }

         if (sessionId) {
            // we have a session, let's redirect to checkout
            // Init stripe
            const stripe = await loadStripe(
               'pk_test_51MJI2WHWHetmJdmAwwjm4iks258aBWZyh9ADIqJVBoAHyhJDLoT1408f7ll4MfghtmklNZvPT7qG1nKfVzXOPqGT00MMUDjgi5',
            );
            stripe.redirectToCheckout({ sessionId });
         }
      });
   };

   return (
      <div className='plansScreen'>
         {subsciption && <p>Renewal date: {new Date(subsciption?.current_period_end * 1000).toLocaleDateString()}</p>}
         {Object.entries(products).map(([productId, productData]) => {
            const isCurrentPackage = productData.name?.toLowerCase().includes(subsciption?.role);
            return (
               <div className={`${isCurrentPackage && 'planScreen__plan--disabled'} plansScreen__plan`} key={productId}>
                  <div className='plansScreen__info'>
                     <h5>{productData.name}</h5>
                     <h6>{productData.description}</h6>
                  </div>
                  <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
                     {isCurrentPackage ? 'Current Packege' : 'Subscribe'}
                  </button>
               </div>
            );
         })}
      </div>
   );
}

export default PlansScreen;
