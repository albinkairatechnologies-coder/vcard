import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAnnual, setIsAnnual] = useState(true)

  const pricing = {
    pro: isAnnual ? 499 : 624,
    enterprise: isAnnual ? 1999 : 2499,
  }

  const formatPrice = (value) => value.toLocaleString('en-IN')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 60)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  }, [])

  return (
    <div className="landing-page">
      <style>{`
        .landing-page *, .landing-page *::before, .landing-page *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .landing-page { font-family: 'DM Sans', sans-serif; background: #f7f5f0; color: #0a0a0f; overflow-x: hidden; }
        .landing-page html { scroll-behavior: smooth; }
        .landing-page nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 20px 60px; background: rgba(247,245,240,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(10,10,15,0.06); }
        .landing-page .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #0a0a0f; text-decoration: none; }
        .landing-page .logo span { color: #0057ff; }
        .landing-page .nav-links { display: flex; gap: 40px; list-style: none; }
        .landing-page .nav-links a { text-decoration: none; color: #3a3a4a; font-size: 14px; font-weight: 400; letter-spacing: 0.2px; transition: color 0.2s; }
        .landing-page .nav-links a:hover { color: #0057ff; }
        .landing-page .nav-cta { background: #0a0a0f !important; color: #fff !important; padding: 10px 22px; border-radius: 50px; font-weight: 500 !important; transition: all 0.2s !important; }
        .landing-page .nav-cta:hover { background: #0057ff !important; transform: translateY(-1px); }
        .landing-page .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 120px 40px 80px; position: relative; overflow: hidden; }
        .landing-page .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,87,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.07) 0%, transparent 60%); }
        .landing-page .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,87,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.04) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%); }
        .landing-page .badge { display: inline-flex; align-items: center; gap: 8px; background: #e8efff; color: #0057ff; font-size: 12px; font-weight: 500; letter-spacing: 0.8px; text-transform: uppercase; padding: 8px 18px; border-radius: 50px; border: 1px solid rgba(0,87,255,0.2); margin-bottom: 32px; position: relative; z-index: 1; animation: fadeUp 0.6s ease both; }
        .landing-page .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #0057ff; animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .landing-page .hero h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(48px, 7vw, 88px); line-height: 1.0; letter-spacing: -2px; color: #0a0a0f; max-width: 900px; position: relative; z-index: 1; animation: fadeUp 0.7s 0.1s ease both; }
        .landing-page .hero h1 em { font-style: normal; color: #0057ff; position: relative; }
        .landing-page .hero-sub { font-size: 18px; font-weight: 300; color: #3a3a4a; max-width: 520px; line-height: 1.7; margin: 28px 0 48px; position: relative; z-index: 1; animation: fadeUp 0.7s 0.2s ease both; }
        .landing-page .hero-actions { display: flex; gap: 16px; align-items: center; position: relative; z-index: 1; animation: fadeUp 0.7s 0.3s ease both; }
        .landing-page .btn-primary { background: #0a0a0f; color: #fff; padding: 16px 36px; border-radius: 50px; font-size: 15px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .landing-page .btn-primary:hover { background: #0057ff; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,87,255,0.3); }
        .landing-page .btn-secondary { color: #0a0a0f; padding: 16px 28px; border-radius: 50px; font-size: 15px; font-weight: 400; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(10,10,15,0.2); transition: all 0.2s; }
        .landing-page .btn-secondary:hover { border-color: #0057ff; color: #0057ff; transform: translateY(-2px); }
        .landing-page .arrow { font-size: 18px; transition: transform 0.2s; }
        .landing-page .btn-primary:hover .arrow { transform: translateX(3px); }
        .landing-page .mockup-strip { position: relative; z-index: 1; margin-top: 80px; animation: fadeUp 0.8s 0.4s ease both; width: 100%; display: flex; justify-content: center; }
        .landing-page .mockup-frame { background: #fff; border-radius: 28px; padding: 12px; box-shadow: 0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05); display: inline-block; max-width: 760px; width: 100%; }
        .landing-page .mockup-inner { background: #f0f2f7; border-radius: 18px; padding: 28px 32px; display: flex; gap: 20px; align-items: center; }
        .landing-page .vcard-preview { background: #fff; border-radius: 20px; padding: 24px; min-width: 200px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); flex-shrink: 0; text-align: left; }
        .landing-page .vcard-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #0057ff, #0084ff); display: flex; align-items: center; justify-content: center; color: white; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 14px; }
        .landing-page .vcard-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #0a0a0f; }
        .landing-page .vcard-role { font-size: 12px; color: #7a7a8e; margin: 2px 0 16px; }
        .landing-page .vcard-contact-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #3a3a4a; margin: 6px 0; }
        .landing-page .vcard-icon { width: 22px; height: 22px; border-radius: 6px; background: #e8efff; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
        .landing-page .vcard-qr { background: #0a0a0f; width: 64px; height: 64px; border-radius: 10px; margin-top: 16px; display: grid; grid-template-columns: repeat(6,1fr); gap: 2px; padding: 8px; }
        .landing-page .qr-dot { background: white; border-radius: 1px; animation: qrBlink 3s ease infinite; }
        @keyframes qrBlink { 0%,90%,100%{opacity:1} 95%{opacity:0.4} }
        .landing-page .mockup-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
        .landing-page .stat-card { background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); text-align: left; }
        .landing-page .stat-label { font-size: 11px; color: #7a7a8e; letter-spacing: 0.3px; margin-bottom: 6px; }
        .landing-page .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; color: #0a0a0f; }
        .landing-page .stat-sub { font-size: 11px; color: #22c55e; margin-top: 2px; }
        .landing-page .stat-chart { display: flex; align-items: flex-end; gap: 3px; margin-top: 10px; height: 32px; }
        .landing-page .bar { flex: 1; border-radius: 3px 3px 0 0; background: #e8efff; transition: height 0.3s; }
        .landing-page .bar.active { background: #0057ff; }
        .landing-page section { padding: 100px 60px; }
        .landing-page .section-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #0057ff; font-weight: 500; margin-bottom: 16px; }
        .landing-page .section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: clamp(32px, 4vw, 48px); letter-spacing: -1px; line-height: 1.1; color: #0a0a0f; max-width: 560px; }
        .landing-page .section-desc { font-size: 17px; color: #3a3a4a; font-weight: 300; line-height: 1.7; max-width: 480px; margin-top: 16px; }
        .landing-page .features { background: #fff; }
        .landing-page .features-header { text-align: center; margin-bottom: 72px; }
        .landing-page .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(10,10,15,0.06); border-radius: 24px; overflow: hidden; max-width: 1100px; margin: 0 auto; }
        .landing-page .feature-cell { background: #fff; padding: 44px 40px; transition: background 0.25s; }
        .landing-page .feature-cell:hover { background: #fafbff; }
        .landing-page .feature-icon { width: 52px; height: 52px; border-radius: 14px; background: #e8efff; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 24px; }
        .landing-page .feature-cell h3 { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 18px; color: #0a0a0f; margin-bottom: 10px; }
        .landing-page .feature-cell p { font-size: 14px; color: #3a3a4a; line-height: 1.7; }
        .landing-page .how { background: #f7f5f0; }
        .landing-page .how-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .landing-page .steps { margin-top: 48px; display: flex; flex-direction: column; gap: 0; }
        .landing-page .step { display: flex; gap: 24px; padding: 28px 0; border-bottom: 1px solid rgba(10,10,15,0.08); cursor: pointer; transition: all 0.2s; }
        .landing-page .step:last-child { border-bottom: none; }
        .landing-page .step-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: #7a7a8e; letter-spacing: 1px; width: 32px; flex-shrink: 0; padding-top: 4px; }
        .landing-page .step-content h4 { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 17px; color: #0a0a0f; margin-bottom: 6px; }
        .landing-page .step-content p { font-size: 14px; color: #3a3a4a; line-height: 1.6; }
        .landing-page .step.active .step-num, .landing-page .step.active h4 { color: #0057ff; }
        .landing-page .how-visual { position: relative; height: 480px; display: flex; align-items: center; justify-content: center; }
        .landing-page .phone-mock { width: 240px; background: #0a0a0f; border-radius: 44px; padding: 16px; box-shadow: 0 40px 80px rgba(0,0,0,0.25); position: relative; }
        .landing-page .phone-screen { background: #fff; border-radius: 32px; overflow: hidden; height: 440px; }
        .landing-page .phone-notch { height: 28px; background: #0a0a0f; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; }
        .landing-page .phone-notch::after { content: ''; width: 80px; height: 10px; background: #1a1a2e; border-radius: 0 0 12px 12px; }
        .landing-page .phone-content { padding: 20px 18px; text-align: left; }
        .landing-page .phone-header-card { background: linear-gradient(135deg, #0057ff 0%, #0084ff 100%); border-radius: 20px; padding: 22px; color: white; margin-bottom: 16px; }
        .landing-page .phone-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: white; margin-bottom: 12px; }
        .landing-page .phone-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 2px; }
        .landing-page .phone-role { font-size: 11px; opacity: 0.8; }
        .landing-page .phone-action-row { display: flex; gap: 8px; margin: 14px 0; }
        .landing-page .phone-btn { flex: 1; background: #e8efff; border-radius: 10px; padding: 10px; text-align: center; font-size: 11px; font-weight: 500; color: #0057ff; }
        .landing-page .phone-divider { height: 1px; background: rgba(10,10,15,0.06); margin: 12px 0; }
        .landing-page .phone-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
        .landing-page .phone-row-icon { width: 28px; height: 28px; border-radius: 8px; background: #e8efff; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
        .landing-page .phone-row-text { font-size: 12px; color: #0a0a0f; }
        .landing-page .phone-row-sub { font-size: 10px; color: #7a7a8e; }
        .landing-page .floating-badge { position: absolute; background: #fff; border-radius: 14px; padding: 12px 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); font-size: 12px; font-weight: 500; color: #0a0a0f; display: flex; align-items: center; gap: 10px; animation: float 4s ease-in-out infinite; text-align: left; }
        .landing-page .floating-badge-icon { font-size: 18px; }
        .landing-page .fb-1 { top: 40px; right: -20px; animation-delay: 0s; }
        .landing-page .fb-2 { bottom: 60px; left: -30px; animation-delay: 2s; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .landing-page .pricing { background: #0a0a0f; text-align: center; position: relative; overflow: hidden; }
        .landing-page .pricing::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,87,255,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 10% 100%, rgba(201,168,76,0.08) 0%, transparent 60%); pointer-events: none; }
        .landing-page .pricing-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; }
        .landing-page .pricing-header { margin-bottom: 72px; position: relative; z-index: 1; }
        .landing-page .pricing-header .section-label { color: #5a8fff; }
        .landing-page .pricing-header .section-title { color: #ffffff; margin: 0 auto; text-align: center; }
        .landing-page .pricing-header .section-desc { color: rgba(255,255,255,0.45); margin: 16px auto 0; text-align: center; }
        .landing-page .billing-toggle { display: inline-flex; align-items: center; gap: 14px; margin-top: 32px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 6px 8px 6px 20px; }
        .landing-page .billing-toggle span { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 400; }
        .landing-page .billing-toggle span.active { color: #fff; font-weight: 500; }
        .landing-page .toggle-track { width: 44px; height: 24px; border-radius: 50px; background: #0057ff; position: relative; cursor: pointer; flex-shrink: 0; transition: background 0.3s; border: 0; }
        .landing-page .toggle-thumb { width: 18px; height: 18px; border-radius: 50%; background: white; position: absolute; top: 3px; left: 3px; transition: transform 0.25s cubic-bezier(.4,0,.2,1); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        .landing-page .toggle-track.annual .toggle-thumb { transform: translateX(20px); }
        .landing-page .save-badge { background: rgba(90,255,180,0.15); color: #5affb4; font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 50px; border: 1px solid rgba(90,255,180,0.2); margin-right: 6px; }
        .landing-page .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1040px; margin: 0 auto; position: relative; z-index: 1; align-items: start; }
        .landing-page .pricing-card { border-radius: 28px; text-align: left; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; position: relative; overflow: hidden; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .landing-page .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.14); }
        .landing-page .card-top { padding: 36px 36px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
        .landing-page .card-body { padding: 28px 36px 36px; }
        .landing-page .pricing-card.featured { background: #fff; border-color: transparent; box-shadow: 0 24px 80px rgba(0,87,255,0.25), 0 0 0 1px rgba(0,87,255,0.3); transform: translateY(-12px); }
        .landing-page .pricing-card.featured:hover { transform: translateY(-18px); box-shadow: 0 40px 100px rgba(0,87,255,0.35), 0 0 0 1px rgba(0,87,255,0.4); }
        .landing-page .featured-glow { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #0057ff, #5a8fff, #0057ff); background-size: 200% 100%; animation: shimmer 3s ease infinite; border-radius: 28px 28px 0 0; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .landing-page .pricing-card.featured .card-top { background: #f7f9ff; border-bottom-color: rgba(0,87,255,0.1); }
        .landing-page .enterprise-border-glow { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); border-radius: 28px 28px 0 0; }
        .landing-page .plan-badge-featured { display: inline-flex; align-items: center; gap: 6px; background: #0057ff; color: white; font-size: 11px; font-weight: 500; padding: 6px 14px; border-radius: 50px; margin-bottom: 20px; letter-spacing: 0.3px; }
        .landing-page .plan-badge-featured::before { content: '✦'; font-size: 9px; }
        .landing-page .plan-badge-enterprise { display: inline-flex; align-items: center; gap: 6px; background: rgba(201,168,76,0.12); color: #c9a84c; font-size: 11px; font-weight: 500; padding: 6px 14px; border-radius: 50px; margin-bottom: 20px; border: 1px solid rgba(201,168,76,0.25); }
        .landing-page .plan-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.5px; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
        .landing-page .pricing-card.featured .plan-name { color: #0a0a0f; }
        .landing-page .plan-tagline { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
        .landing-page .pricing-card.featured .plan-tagline { color: #7a7a8e; }
        .landing-page .price { display: flex; align-items: flex-start; gap: 2px; margin-bottom: 4px; }
        .landing-page .price-currency { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 10px; }
        .landing-page .pricing-card.featured .price-currency { color: #7a7a8e; }
        .landing-page .price-amount { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 60px; color: #fff; line-height: 1; letter-spacing: -2px; transition: all 0.3s; }
        .landing-page .pricing-card.featured .price-amount { color: #0a0a0f; }
        .landing-page .price-period { font-size: 12px; color: rgba(255,255,255,0.3); margin-bottom: 0; }
        .landing-page .pricing-card.featured .price-period { color: #7a7a8e; }
        .landing-page .features-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 16px; font-weight: 500; }
        .landing-page .pricing-card.featured .features-label { color: #7a7a8e; }
        .landing-page .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .landing-page .plan-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.6); line-height: 1.5; }
        .landing-page .pricing-card.featured .plan-features li { color: #3a3a4a; }
        .landing-page .check-wrap { width: 18px; height: 18px; border-radius: 50%; background: rgba(90,255,180,0.12); border: 1px solid rgba(90,255,180,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .landing-page .pricing-card.featured .check-wrap { background: rgba(0,87,255,0.1); border-color: rgba(0,87,255,0.25); }
        .landing-page .pricing-card.enterprise .check-wrap { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.25); }
        .landing-page .check { font-size: 10px; color: #5affb4; }
        .landing-page .pricing-card.featured .check { color: #0057ff; }
        .landing-page .pricing-card.enterprise .check { color: #c9a84c; }
        .landing-page .plan-cta { width: 100%; padding: 15px 20px; border-radius: 14px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s cubic-bezier(.4,0,.2,1); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); letter-spacing: 0.1px; }
        .landing-page .plan-cta .cta-arrow { transition: transform 0.2s; font-size: 16px; }
        .landing-page .plan-cta:hover { background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.2); }
        .landing-page .plan-cta:hover .cta-arrow { transform: translateX(3px); }
        .landing-page .plan-cta.featured-cta { background: #0057ff; color: white; border-color: #0057ff; box-shadow: 0 8px 32px rgba(0,87,255,0.35); font-weight: 600; }
        .landing-page .plan-cta.featured-cta:hover { background: #0040cc; border-color: #0040cc; box-shadow: 0 12px 40px rgba(0,87,255,0.45); transform: translateY(-1px); }
        .landing-page .plan-cta.enterprise-cta { background: rgba(201,168,76,0.1); color: #c9a84c; border-color: rgba(201,168,76,0.3); }
        .landing-page .plan-cta.enterprise-cta:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.5); color: #e0b84f; }
        .landing-page .plan-note { text-align: center; font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 12px; }
        .landing-page .pricing-card.featured .plan-note { color: #7a7a8e; }
        .landing-page .testimonials { background: #f7f5f0; }
        .landing-page .testi-inner { max-width: 1100px; margin: 0 auto; }
        .landing-page .testi-header { margin-bottom: 56px; }
        .landing-page .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .landing-page .testi-card { background: #fff; border-radius: 24px; padding: 36px 32px; border: 1px solid rgba(10,10,15,0.06); text-align: left; }
        .landing-page .stars { color: #c9a84c; font-size: 14px; letter-spacing: 2px; margin-bottom: 18px; }
        .landing-page .testi-text { font-size: 15px; line-height: 1.7; color: #3a3a4a; font-style: italic; margin-bottom: 24px; }
        .landing-page .testi-author { display: flex; align-items: center; gap: 12px; }
        .landing-page .testi-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: white; }
        .landing-page .testi-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px; color: #0a0a0f; }
        .landing-page .testi-role { font-size: 12px; color: #7a7a8e; }
        .landing-page .cta-band { background: #0a0a0f; padding: 100px 60px; text-align: center; position: relative; overflow: hidden; }
        .landing-page .cta-band::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,87,255,0.2) 0%, transparent 70%); }
        .landing-page .cta-band h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 64px); color: #fff; letter-spacing: -1.5px; line-height: 1.05; max-width: 700px; margin: 0 auto 24px; position: relative; z-index: 1; }
        .landing-page .cta-band p { font-size: 17px; font-weight: 300; color: rgba(255,255,255,0.6); max-width: 420px; margin: 0 auto 48px; line-height: 1.7; position: relative; z-index: 1; }
        .landing-page .cta-band .btn-primary { background: #0057ff; box-shadow: 0 8px 40px rgba(0,87,255,0.4); position: relative; z-index: 1; font-size: 16px; padding: 18px 44px; }
        .landing-page footer { background: #0a0a0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 60px 60px 40px; }
        .landing-page .footer-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .landing-page .footer-brand .logo { color: #fff; font-size: 22px; }
        .landing-page .footer-brand p { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; margin-top: 14px; max-width: 260px; }
        .landing-page .footer-col h5 { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
        .landing-page .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .landing-page .footer-col ul a { text-decoration: none; font-size: 14px; color: rgba(255,255,255,0.55); transition: color 0.2s; }
        .landing-page .footer-col ul a:hover { color: #fff; }
        .landing-page .footer-bottom { max-width: 1100px; margin: 32px auto 0; display: flex; justify-content: space-between; align-items: center; }
        .landing-page .footer-bottom p { font-size: 13px; color: rgba(255,255,255,0.25); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .landing-page .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .landing-page .reveal.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 900px) {
          .landing-page nav { padding: 16px 24px; }
          .landing-page .nav-links { display: none; }
          .landing-page section { padding: 72px 24px; }
          .landing-page .features-grid, .landing-page .pricing-grid, .landing-page .testi-grid { grid-template-columns: 1fr; }
          .landing-page .how-inner { grid-template-columns: 1fr; }
          .landing-page .how-visual { display: none; }
          .landing-page .footer-inner { grid-template-columns: 1fr 1fr; }
          .landing-page .mockup-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav>
        <Link to="/" className="logo">Kaira<span>.</span></Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><Link to="/register" className="nav-cta">Get Started Free</Link></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="badge">
          <div className="badge-dot"></div>
          Digital Business Cards — Reimagined
        </div>
        <h1>Your Identity,<br />One <em>Smart</em> Card</h1>
        <p className="hero-sub">
          Create stunning digital vCards in seconds. Share with a tap, scan, or link — and track every connection you make.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Create Your vCard <span className="arrow">→</span></Link>
          <a href="#how" className="btn-secondary">See how it works</a>
        </div>

        <div className="mockup-strip">
          <div className="mockup-frame">
            <div className="mockup-inner">
              <div className="vcard-preview">
                <div className="vcard-avatar">AK</div>
                <div className="vcard-name">Arjun Kumar</div>
                <div className="vcard-role">Product Designer · Kaira Technology</div>
                <div className="vcard-contact-row"><div className="vcard-icon">📞</div>+91 98765 43210</div>
                <div className="vcard-contact-row"><div className="vcard-icon">✉️</div>arjun@kairatechnology.com</div>
                <div className="vcard-contact-row"><div className="vcard-icon">🔗</div>kairatechnology.com</div>
                <div className="vcard-qr">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="qr-dot" style={{ animationDelay: `${i * 0.1}s`, opacity: i % 4 === 1 ? 0.3 : i % 5 === 0 ? 0.4 : 1 }} />
                  ))}
                </div>
              </div>

              <div className="mockup-stats">
                <div className="stat-card">
                  <div className="stat-label">Cards Shared</div>
                  <div className="stat-value">1,248</div>
                  <div className="stat-sub">↑ 18% this week</div>
                  <div className="stat-chart">{[40, 55, 45, 70, 60, 85].map((h, i) => <div key={i} className={`bar ${i === 5 ? 'active' : ''}`} style={{ height: `${h}%` }} />)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Profile Views</div>
                  <div className="stat-value">3.6k</div>
                  <div className="stat-sub">↑ 31% this month</div>
                  <div className="stat-chart">{[35, 60, 50, 45, 80, 90].map((h, i) => <div key={i} className={`bar ${i >= 4 ? 'active' : ''}`} style={{ height: `${h}%` }} />)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">QR Scans</div>
                  <div className="stat-value">892</div>
                  <div className="stat-sub">↑ 24% vs last week</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Connections</div>
                  <div className="stat-value">156</div>
                  <div className="stat-sub">↑ 12 new today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-header reveal">
          <div className="section-label">Everything You Need</div>
          <h2 className="section-title">Built for professionals<br />who mean business</h2>
          <p className="section-desc">Every feature designed to help you make memorable first impressions and track meaningful connections.</p>
        </div>
        <div className="features-grid reveal">
          {[
            { icon: '✦', title: 'Beautiful Templates', desc: 'Choose from 50+ professionally designed templates. Customise colors, fonts, and layout to match your brand identity perfectly.' },
            { icon: '📲', title: 'Instant QR Sharing', desc: 'Generate a unique QR code for every card. Anyone can scan and save your contact in one tap — no app required.' },
            { icon: '📊', title: 'Real-time Analytics', desc: 'See who viewed your card, when they scanned it, and where they came from. Know your network like never before.' },
            { icon: '🔗', title: 'One Link, Everything', desc: 'A single shareable link houses your website, social profiles, portfolio, and contact — all in one polished page.' },
            { icon: '🏢', title: 'Team Management', desc: 'Deploy branded cards across your entire organisation. Maintain consistency while giving each member their own card.' },
            { icon: '🔒', title: 'Privacy & Control', desc: 'Choose exactly what information to share and with whom. Update your details anytime — changes reflect instantly everywhere.' },
          ].map((f, i) => (
            <div key={i} className="feature-cell">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-inner">
          <div>
            <div className="section-label reveal">Simple Process</div>
            <h2 className="section-title reveal">Up and running<br />in 3 minutes</h2>
            <p className="section-desc reveal">No design skills needed. Create a card that impresses everyone.</p>
            <div className="steps">
              {[
                ['Create your profile', 'Enter your details, upload your photo, and add your links. Our guided builder makes it effortless.'],
                ['Choose a design', 'Pick from beautifully crafted templates or customise every element to match your brand colours.'],
                ['Share everywhere', 'Get your unique link and QR code. Share via WhatsApp, email, LinkedIn, or print on physical cards.'],
              ].map((step, index) => (
                <div key={step[0]} className={`step reveal ${activeStep === index ? 'active' : ''}`} onClick={() => setActiveStep(index)}>
                  <div className="step-num">{`0${index + 1}`}</div>
                  <div className="step-content">
                    <h4>{step[0]}</h4>
                    <p>{step[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="how-visual reveal">
            <div className="phone-mock">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <div className="phone-header-card">
                    <div className="phone-avatar">RK</div>
                    <div className="phone-name">Riya Krishnan</div>
                    <div className="phone-role">Co-Founder · Kaira Technology</div>
                  </div>
                  <div className="phone-action-row">
                    <div className="phone-btn">💬 Message</div>
                    <div className="phone-btn">📥 Save</div>
                    <div className="phone-btn">🔗 Share</div>
                  </div>
                  <div className="phone-divider"></div>
                  <div className="phone-row"><div className="phone-row-icon">📞</div><div><div className="phone-row-text">+91 90000 12345</div><div className="phone-row-sub">Mobile</div></div></div>
                  <div className="phone-row"><div className="phone-row-icon">✉️</div><div><div className="phone-row-text">riya@kairatechnology.com</div><div className="phone-row-sub">Work Email</div></div></div>
                  <div className="phone-row"><div className="phone-row-icon">🌐</div><div><div className="phone-row-text">kairatechnology.com</div><div className="phone-row-sub">Website</div></div></div>
                  <div className="phone-row"><div className="phone-row-icon">💼</div><div><div className="phone-row-text">LinkedIn Profile</div><div className="phone-row-sub">Professional</div></div></div>
                </div>
              </div>
            </div>
            <div className="floating-badge fb-1">
              <div className="floating-badge-icon">✅</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0f' }}>Card saved!</div><div style={{ fontSize: 11, color: '#7a7a8e' }}>Added to contacts</div></div>
            </div>
            <div className="floating-badge fb-2">
              <div className="floating-badge-icon">👁</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0f' }}>12 views today</div><div style={{ fontSize: 11, color: '#7a7a8e' }}>Last scan: 2 min ago</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="pricing-dots"></div>
        <div className="pricing-header reveal">
          <div className="section-label">Simple Pricing</div>
          <h2 className="section-title">Plans for every<br />professional</h2>
          <p className="section-desc">Start free. Upgrade when you're ready to unlock the full potential.</p>
          <div className="billing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Monthly</span>
            <button type="button" className={`toggle-track ${isAnnual ? 'annual' : ''}`} onClick={() => setIsAnnual((v) => !v)} aria-label="Toggle billing cycle">
              <div className="toggle-thumb"></div>
            </button>
            <span className={isAnnual ? 'active' : ''}>Annual</span>
            <span className="save-badge">Save 20%</span>
          </div>
        </div>
        <div className="pricing-grid reveal">
          <div className="pricing-card starter">
            <div className="card-top">
              <div className="plan-name">Starter</div>
              <div className="plan-tagline">Perfect for individuals just getting started</div>
              <div className="price"><span className="price-currency">₹</span><span className="price-amount">0</span></div>
              <div className="price-period">Free forever, no credit card needed</div>
            </div>
            <div className="card-body">
              <div className="features-label">What's included</div>
              <ul className="plan-features">{['1 digital vCard', 'QR code generation', '5 card templates', 'Basic analytics', 'Kaira subdomain'].map((f) => <li key={f}><span className="check-wrap"><span className="check">✓</span></span>{f}</li>)}</ul>
              <Link to="/register" className="plan-cta">Get Started Free <span className="cta-arrow">→</span></Link>
              <div className="plan-note">No credit card required</div>
            </div>
          </div>

          <div className="pricing-card featured">
            <div className="featured-glow"></div>
            <div className="card-top">
              <div className="plan-badge-featured">Most Popular</div>
              <div className="plan-name">Professional</div>
              <div className="plan-tagline">For serious networkers and growing teams</div>
              <div className="price"><span className="price-currency">₹</span><span className="price-amount">{formatPrice(pricing.pro)}</span></div>
              <div className="price-period">{isAnnual ? 'per month · billed annually' : 'per month · billed monthly'}</div>
            </div>
            <div className="card-body">
              <div className="features-label">Everything in Starter, plus</div>
              <ul className="plan-features">{['10 digital vCards', 'Custom domain', '50+ premium templates', 'Advanced analytics & insights', 'CRM integrations', 'Priority support'].map((f) => <li key={f}><span className="check-wrap"><span className="check">✓</span></span>{f}</li>)}</ul>
              <Link to="/register" className="plan-cta featured-cta">Start 14-day Free Trial <span className="cta-arrow">→</span></Link>
              <div className="plan-note">Cancel anytime · No lock-in</div>
            </div>
          </div>

          <div className="pricing-card enterprise">
            <div className="enterprise-border-glow"></div>
            <div className="card-top">
              <div className="plan-badge-enterprise">✦ Enterprise</div>
              <div className="plan-name">Business</div>
              <div className="plan-tagline">Full control for large organisations</div>
              <div className="price"><span className="price-currency">₹</span><span className="price-amount">{formatPrice(pricing.enterprise)}</span></div>
              <div className="price-period">{isAnnual ? 'per month · billed annually' : 'per month · billed monthly'}</div>
            </div>
            <div className="card-body">
              <div className="features-label">Everything in Pro, plus</div>
              <ul className="plan-features">{['Unlimited vCards', 'Team management dashboard', 'Brand kit & white labelling', 'API access', 'SSO & admin controls', 'Dedicated account manager'].map((f) => <li key={f}><span className="check-wrap"><span className="check">✓</span></span>{f}</li>)}</ul>
              <Link to="/register" className="plan-cta enterprise-cta">Contact Sales <span className="cta-arrow">→</span></Link>
              <div className="plan-note">Custom invoicing available</div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testi-inner">
          <div className="testi-header reveal">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Trusted by professionals<br />across India</h2>
          </div>
          <div className="testi-grid">
            {[
              { avatar: 'SP', grad: 'linear-gradient(135deg,#0057ff,#0084ff)', name: 'Suresh Pandian', role: 'Sales Director, Chennai', text: '"Kaira completely changed how I network. I shared my card with 40 people at a conference and got 15 follow-up messages the same day."' },
              { avatar: 'PM', grad: 'linear-gradient(135deg,#7c3aed,#a855f7)', name: 'Priya Muthukumar', role: 'Founder, Madurai', text: '"The analytics dashboard is a game-changer. I can see exactly when someone views my card and follow up at the right time."' },
              { avatar: 'VR', grad: 'linear-gradient(135deg,#059669,#10b981)', name: 'Vijay Raghunathan', role: 'HR Head, Coimbatore', text: '"We rolled out Kaira for our 80-person team in one afternoon. The brand consistency and the admin panel made it incredibly smooth."' },
            ].map((item) => (
              <div key={item.name} className="testi-card reveal">
                <div className="stars">★★★★★</div>
                <p className="testi-text">{item.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: item.grad }}>{item.avatar}</div>
                  <div><div className="testi-name">{item.name}</div><div className="testi-role">{item.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band">
        <h2>Ready to make your mark?</h2>
        <p>Join thousands of professionals already using Kaira to grow their network smarter.</p>
        <Link to="/register" className="btn-primary">Create Your Free vCard <span className="arrow">→</span></Link>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo">Kaira<span style={{ color: '#0057ff' }}>.</span></Link>
            <p>Professional digital vCards built for the way modern India networks. From freelancers to Fortune 500 teams.</p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link to="/editor">Features</Link></li>
              <li><Link to="/editor">Templates</Link></li>
              <li><Link to="/register">Pricing</Link></li>
              <li><Link to="/editor">Integrations</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Kaira Technology. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.2)' }}>Made with care in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  )
}
