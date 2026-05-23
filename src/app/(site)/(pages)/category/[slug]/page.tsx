import ShopWithSidebar from "@/components/ShopWithSidebar";

const ShopWithSidebarPage = async ({ params }) => {
  const { slug } = await params;

  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
