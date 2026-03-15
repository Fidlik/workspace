type PagesContext = {
  request: Request;
  env: {
    FORM_PRIMARY_EMAIL?: string;
    FORM_CC_EMAILS?: string;
  };
};

const FALLBACK_PRIMARY_EMAIL = 'daniel.richter.st@gmail.com';
const FALLBACK_CC_EMAILS = 'zdenek@machura.cz';

export const onRequestPost = async (context: PagesContext) => {
  const formData = await context.request.formData();

  const website = String(formData.get('website') ?? '').trim();
  if (website) {
    return Response.redirect(new URL('/dekujeme', context.request.url), 303);
  }

  const formType = String(formData.get('formType') ?? 'poptavka');
  const product = String(formData.get('product') ?? '').trim();
  const productLabel = String(formData.get('productLabel') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const dimensions = String(formData.get('dimensions') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const consent = formData.get('consent');

  if (!name || !phone || !consent) {
    return new Response('Chybi povinne udaje formulare.', { status: 400 });
  }

  const primaryEmail = context.env.FORM_PRIMARY_EMAIL || FALLBACK_PRIMARY_EMAIL;
  const ccEmails = context.env.FORM_CC_EMAILS || FALLBACK_CC_EMAILS;
  const subjectPrefix = formType === 'objednavka' ? 'Objednavka' : 'Poptavka';
  const resolvedProduct = productLabel || product || 'nova-zprava';
  const submittedAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

  const relayPayload = {
    _cc: ccEmails,
    _subject: `${subjectPrefix}: ${resolvedProduct}`,
    _replyto: email || undefined,
    _template: 'table',
    _captcha: 'false',
    form_type: formType,
    product: resolvedProduct,
    name,
    phone,
    email: email || 'neuvedeno',
    location: location || 'neuvedeno',
    dimensions: dimensions || 'neuvedeno',
    message: message || 'bez zpravy',
    submitted_at: submittedAt,
  };

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(primaryEmail)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(relayPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(`Nepodarilo se odeslat formular: ${errorText}`, { status: 502 });
  }

  return Response.redirect(new URL('/dekujeme', context.request.url), 303);
};
