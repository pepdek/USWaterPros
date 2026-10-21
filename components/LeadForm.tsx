import InstantPriceBox from './store/InstantPriceBox';

// The callback form is gone. Every old call site now shows the ZIP box that opens the instant-price wizard.
export default function LeadForm(_: { service?: string }) {
  return <InstantPriceBox />;
}
