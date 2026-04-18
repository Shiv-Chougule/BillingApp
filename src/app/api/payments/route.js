import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Payment from '../../models/Payments';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Parse and validate markedInvoices first
    const parsedMarkedInvoices = body.markedInvoices?.map(invoice => ({
      invoiceId: new mongoose.Types.ObjectId(invoice.invoiceId),
      originalAmount: parseFloat(invoice.originalAmount),
      amountPaid: parseFloat(invoice.amountPaid),
      remainingAmount: parseFloat(invoice.remainingAmount)
    })) || [];

    // Re-derive totalPaid server-side from markedInvoices instead of trusting client value
    const derivedTotalPaid = parsedMarkedInvoices.reduce(
      (sum, invoice) => sum + (invoice.amountPaid || 0),
      0
    );

    // Convert string amounts to numbers
    const paymentData = {
      customerName: body.customerName,
      outstandingAmount: parseFloat(body.outstandingAmount),
      bankCharges: parseFloat(body.bankCharges || 0),
      paymentDate: new Date(body.paymentDate),
      paymentMode: body.paymentMode,
      paymentNumber: body.payment, // Map frontend's 'payment' to schema's 'paymentNumber'
      referenceNumber: body.referenceNumber,
      notes: body.notes,
      markedInvoices: parsedMarkedInvoices,
      totalPaid: derivedTotalPaid  // Backend-derived, not client-trusted
    };

    // Validate required fields
    if (!paymentData.customerName || isNaN(paymentData.outstandingAmount) || !paymentData.paymentDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPayment = await Payment.create(paymentData);

    return NextResponse.json(
      { success: true, data: newPayment },
      { status: 201 }
    );

  } catch (error) {
    console.error('Payment creation error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Payment reference already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const payments = await Payment.find();

    // Return the payments as an array of objects
    return NextResponse.json(payments.map(payment => ({ payment })), { status: 200 });
  } catch (error) {
    console.error('GET API error:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}