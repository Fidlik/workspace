export const onRequestPost = async (context: any) => {
  const formData = await context.request.formData();
  const payload = Object.fromEntries(formData.entries());

  // Prepared for future notification delivery or persistence wiring in Cloudflare.
  console.log('DR form submission', payload);

  return Response.redirect(new URL('/dekujeme', context.request.url), 303);
};
