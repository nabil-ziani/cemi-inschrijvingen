import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    paymentAmount: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName, paymentAmount
}) => (
    <div style={{ minWidth: '100%', margin: 0, padding: 0, backgroundColor: '#242424' }}>
        <div style={{ backgroundColor: '#242424' }}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0} align="center">
                <tr>
                    <td
                        style={{
                            fontSize: 0,
                            lineHeight: 0,
                            backgroundColor: '#242424',
                        }}
                        valign="top"
                        align="center"
                    >
                        <table width="100%" cellPadding="0" cellSpacing="0" border={0} align="center" id="innerTable">
                            <tr><td><div style={{ lineHeight: '25px', fontSize: '1px', display: 'block' }}>&nbsp;&nbsp;</div></td></tr>
                            <tr><td>
                                <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <tr>
                                        <td style={{ backgroundColor: '#F8F8F8', width: '420px', padding: '0 30px 40px 30px' }}>
                                            <table width="100%" cellPadding="0" cellSpacing="0">
                                                <tr><td><div style={{ lineHeight: '25px', fontSize: '1px', display: 'block' }}>&nbsp;&nbsp;</div></td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '80px', padding: '0 0 50px 0' }}>
                                                                <div style={{ fontSize: '0px' }}>
                                                                    <img
                                                                        style={{
                                                                            display: 'block',
                                                                            border: 0,
                                                                            height: 'auto',
                                                                            width: '100%',
                                                                            margin: 0,
                                                                            maxWidth: '100%',
                                                                        }}
                                                                        width="131"
                                                                        height="53.265625"
                                                                        alt=""
                                                                        src="https://466c150c-872f-4af9-8fab-12141e7655d2.b-cdn.net/e/90ba1811-2aac-4b5b-bc21-49a827be7280/60efd0ea-0bbc-41bd-9ac5-5da349a96a2b.png"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 20px 0' }}>
                                                                <h1 style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '28px',
                                                                    fontWeight: 800,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '26px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-1.04px',
                                                                    direction: 'ltr',
                                                                    color: '#191919',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Bevestiging herinschrijving
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 22px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Nabil Ziani is heringeschreven voor het volgende schooljaar, hieronder vind je de gegevens nog eens op een rijtje:
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    <span style={{ fontWeight: 'bold' }}>Niveau</span>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 22px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Tamhiedi
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    <span style={{ fontWeight: 'bold' }}>Klastype</span>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 22px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Fysiek klaslokaal
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    <span style={{ fontWeight: 'bold' }}>Betaling</span>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 22px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Online betaling
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 22px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Voor eventuele vragen of opmerkingen, neem contact met ons op via WhatsApp of via e-mail naar <a href="mailto:support@school.com" style={{ textDecoration: 'none', color: '#007bff' }}>support@school.com</a>.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td>
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <tr>
                                                            <td style={{ width: '420px', padding: '0 0 30px 0' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontFamily: 'Albert Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
                                                                    lineHeight: '22px',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'normal',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    textTransform: 'none',
                                                                    letterSpacing: '-0.56px',
                                                                    direction: 'ltr',
                                                                    color: '#333333',
                                                                    textAlign: 'left'
                                                                }}>
                                                                    Met vriendelijke groet,<br />Team School
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td></tr>
                                                <tr><td><div style={{ lineHeight: '25px', fontSize: '1px', display: 'block' }}>&nbsp;&nbsp;</div></td></tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td></tr>
                            <tr><td><div style={{ lineHeight: '25px', fontSize: '1px', display: 'block' }}>&nbsp;&nbsp;</div></td></tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </div>
);
