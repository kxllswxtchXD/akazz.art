import { motion } from "framer-motion";
import Head from "next/head";

const Unauthorized = () => { 
  return (
    <>
      <Head>
        <title>Akazz • 403 Forbidden</title>
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <div className="min-h-screen p-8 mt-4">
      <div className="text-center">
        <span className='mt-4 block'>Você não tem permissão para acessar este site.</span>
        <span className='mt-4 block'>Tente novamente usando um desktop ou notebook.</span>
      </div>
    </div>
  </motion.div>
    </>
  ); 
};

export default Unauthorized;
