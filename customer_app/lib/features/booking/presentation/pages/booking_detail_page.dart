import 'package:dotech_customer/features/booking/domain/entities/booking.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_customer/features/booking/presentation/bloc/booking_bloc.dart';
import 'package:dotech_customer/injection_container/injection_container.dart' as di;
import 'package:intl/intl.dart';

class BookingDetailPage extends StatelessWidget {
  final String bookingId;

  const BookingDetailPage({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    // Create a NEW instance of BookingBloc specifically for this page/detail view
    return BlocProvider(
      create: (context) => di.sl<BookingBloc>()..add(GetBookingDetailEvent(bookingId)),
      child: Scaffold(
        appBar: AppBar(title: const Text('Booking Details')),
        body: BlocBuilder<BookingBloc, BookingState>(
          builder: (context, state) {
            if (state is BookingLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is BookingError) {
              return Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Error: ${state.message}', style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<BookingBloc>().add(GetBookingDetailEvent(bookingId));
                    },
                    child: const Text('Retry'),
                  )
                ],
              ));
            } else if (state is BookingDetailLoaded) {
              return _buildDetailContent(context, state.booking);
            }
            return const Center(child: Text('Initializing...'));
          },
        ),
      ),
    );
  }

  Widget _buildDetailContent(BuildContext context, Booking booking) {
    final dateFormat = DateFormat('MMM dd, yyyy - hh:mm a');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildStatusBadge(booking.status),
          const SizedBox(height: 24),
          
          Text(
            booking.serviceName ?? 'Unknown Service',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Booking ID: #${booking.id.substring(0, 8)}',
             style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
          ),
           const Divider(height: 32),

          _buildInfoRow(Icons.calendar_today, 'Date & Time', dateFormat.format(booking.scheduledAt)),
          const SizedBox(height: 16),
          if (booking.price != null)
             _buildInfoRow(Icons.attach_money, 'Price', '\$${booking.price!.toStringAsFixed(2)}'),
          if (booking.durationMinutes != null)
             _buildInfoRow(Icons.timer, 'Duration', '${booking.durationMinutes} mins'),
          
          const Divider(height: 32),
          
          // Future: Map View or Provider Details could go here
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toUpperCase()) {
      case 'PENDING': color = Colors.orange; break;
      case 'ACCEPTED': color = Colors.blue; break;
      case 'COMPLETED': color = Colors.green; break;
      case 'REJECTED': color = Colors.red; break;
      default: color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.indigo, size: 20),
        const SizedBox(width: 12),
         Expanded(
           child: Column(
             crossAxisAlignment: CrossAxisAlignment.start,
             children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
             ],
           ),
         ),
      ],
    );
  }
}
