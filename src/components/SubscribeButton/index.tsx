import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe.js';
import styles from './styles.module.scss'

// locais seguros para fazer chamadas seguras com chaves que não podem estar a disposição de qualquer um

// getStaticProps (SSG)
// getServerSideProps (SSR)
// API routes

//os 2 gets serao utilizados enquanto a página é renderizada
//o API route é utilizado a partir de interações do usuario

interface SubscribeButtonProps {
    priceId: string;
}
export function SubscribeButton({priceId}: SubscribeButtonProps) {
    const [session] = useSession()
    const router = useRouter()

    async function handleSubscribe() {

        if(!session) {

            signIn('github')
            return;

        }

        if(session.activeSubscription){
            router.push('/posts')
            return;
        }

        try {

            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId})

        } catch (err) {
            alert(err.message);
        }
        
    }

    return (
        <button type="button" onClick={handleSubscribe} className={styles.subscribeButton}>
            Subscribe Now
        </button>
    )
}